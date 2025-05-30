import type { CalculationInput, CalculationResult } from '../types';
import { federalTaxBrackets, stateTaxRates, cityTaxRates } from '../data/taxData';

/**
 * Calculates federal tax based on income and filing status
 */
export const calculateFederalTax = (annualIncome: number, filingStatus: string): number => {
  const brackets = federalTaxBrackets[filingStatus as keyof typeof federalTaxBrackets];
  
  let tax = 0;
  let remainingIncome = annualIncome;
  
  for (let i = 0; i < brackets.length; i++) {
    const { min, max, rate } = brackets[i];
    
    if (remainingIncome <= 0) break;
    
    const maxValue = max === null ? Infinity : max;
    const taxableInThisBracket = Math.min(remainingIncome, maxValue - min);
    
    tax += taxableInThisBracket * rate;
    remainingIncome -= taxableInThisBracket;
  }
  
  return tax;
};

const calculateStateTax = (annualIncome: number, state: string): number => {
  const stateRate = stateTaxRates[state];
  if (!stateRate) return 0;
  
  if (stateRate.type === 'flat' && stateRate.rate !== undefined) {
    return annualIncome * stateRate.rate;
  } else if (stateRate.type === 'progressive' && stateRate.brackets && stateRate.brackets.length > 0) {
    // Progressive tax calculation similar to federal
    let tax = 0;
    let remainingIncome = annualIncome;
    
    for (let i = 0; i < stateRate.brackets.length; i++) {
      const bracket = stateRate.brackets[i];
      const min = bracket.min;
      const max = bracket.max === null ? Infinity : bracket.max;
      const rate = bracket.rate;
      
      if (remainingIncome <= 0) break;
      
      const taxableInThisBracket = Math.min(remainingIncome, max - min);
      
      tax += taxableInThisBracket * rate;
      remainingIncome -= taxableInThisBracket;
    }
    
    return tax;
  }
  
  return 0;
};

/**
 * Calculates city tax based on income, city, and state
 */
const calculateCityTax = (annualIncome: number, city: string, state: string): number => {
  if (!city) return 0;
  
  const cityRate = cityTaxRates[city];
  if (!cityRate || cityRate.state !== state) return 0;
  
  return annualIncome * cityRate.rate;
};

/**
 * Normalizes income to annual amount based on pay period
 */
const normalizeToAnnualIncome = (income: number, payPeriod: string): number => {
  switch (payPeriod) {
    case 'annual': return income;
    case 'monthly': return income * 12;
    case 'semiMonthly': return income * 24;
    case 'biweekly': return income * 26;
    case 'weekly': return income * 52;
    default: return income;
  }
};

/**
 * Calculates take-home pay based on input parameters
 */
export const calculateTakeHomePay = (input: CalculationInput): CalculationResult => {
  const { grossIncome, payPeriod, state, city, filingStatus } = input;
  
  // Normalize to annual income for calculations
  const annualIncome = normalizeToAnnualIncome(grossIncome, payPeriod);
  
  // Calculate federal income tax
  const federalTax = calculateFederalTax(annualIncome, filingStatus);
  
  // Calculate state income tax
  const stateTax = calculateStateTax(annualIncome, state);
  
  // Calculate city/local tax
  const cityTax = calculateCityTax(annualIncome, city, state);
  
  // Calculate FICA (Social Security) tax - 6.2% up to the wage base limit
  const ficaTax = Math.min(annualIncome, 160200) * 0.062;
  
  // Calculate Medicare tax - 1.45% on all earnings
  const medicareTax = annualIncome * 0.0145;
  
  // Additional Medicare tax for high earners - 0.9% on earnings above threshold
  const additionalMedicareTax = filingStatus === 'married' && annualIncome > 250000 ? (annualIncome - 250000) * 0.009 :
                               filingStatus === 'single' && annualIncome > 200000 ? (annualIncome - 200000) * 0.009 :
                               filingStatus === 'headOfHousehold' && annualIncome > 200000 ? (annualIncome - 200000) * 0.009 : 0;
  
  const totalTax = federalTax + stateTax + cityTax + ficaTax + medicareTax + additionalMedicareTax;
  const netIncome = annualIncome - totalTax;
  const effectiveTaxRate = totalTax / annualIncome;
  
  // Convert back to the original pay period
  const periodFactor = payPeriod === 'annual' ? 1 :
                      payPeriod === 'monthly' ? 12 :
                      payPeriod === 'semiMonthly' ? 24 :
                      payPeriod === 'biweekly' ? 26 :
                      payPeriod === 'weekly' ? 52 : 1;
  
  return {
    grossIncome: grossIncome,
    netIncome: netIncome / periodFactor,
    federalTax: federalTax / periodFactor,
    stateTax: stateTax / periodFactor,
    cityTax: cityTax / periodFactor,
    ficaTax: ficaTax / periodFactor,
    medicareTax: (medicareTax + additionalMedicareTax) / periodFactor,
    totalTax: totalTax / periodFactor,
    effectiveTaxRate: effectiveTaxRate
  };
};

// Function to get available states
export const getAvailableStates = (): string[] => {
  return Object.keys(stateTaxRates).sort();
};

// Function to get available cities for a state
export const getAvailableCities = (state: string): string[] => {
  const cityRatesForState = cityTaxRates[state] || cityTaxRates.default;
  return Object.keys(cityRatesForState)
    .filter(city => city !== 'default')
    .sort();
};
