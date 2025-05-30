import type { SpecialIncomeItem } from '../types';
import { calculateFederalTax } from './taxCalculationService';

/**
 * Calculates the tax impact of special income items
 */
export const calculateSpecialIncomeTaxImpact = (
  baseIncome: number,
  specialIncomeItems: SpecialIncomeItem[],
  filingStatus: string
): {
  itemType: string;
  amount: number;
  withholding: number;
  additionalTax: number;
  effectiveTaxRate: number;
  withholdingShortfall: number;
  marginalTaxRate: number;
}[] => {
  // Calculate base tax without special income
  const baseTax = calculateFederalTax(baseIncome, filingStatus);
  
  // Calculate tax impact for each special income item
  return specialIncomeItems.map(item => {
    // Calculate tax with this item added to base income
    const combinedIncome = baseIncome + item.amount;
    const combinedTax = calculateFederalTax(combinedIncome, filingStatus);
    
    // The additional tax caused by this item
    const additionalTax = combinedTax - baseTax;
    
    // Calculate effective tax rate on this item
    const effectiveTaxRate = additionalTax / item.amount;
    
    // Calculate withholding shortfall
    const withholdingShortfall = Math.max(0, additionalTax - item.withholding);
    
    // Calculate marginal tax rate
    const marginalTaxRate = getMarginalTaxRate(baseIncome, item.amount, filingStatus);
    
    return {
      itemType: item.type,
      amount: item.amount,
      withholding: item.withholding,
      additionalTax,
      effectiveTaxRate,
      withholdingShortfall,
      marginalTaxRate
    };
  });
};

/**
 * Calculates the marginal tax rate for a given income and filing status
 */
const getMarginalTaxRate = (baseIncome: number, additionalIncome: number, filingStatus: string): number => {
  // Calculate tax on base income
  const baseTax = calculateFederalTax(baseIncome, filingStatus);
  
  // Calculate tax on base income plus a small increment to find marginal rate
  const incrementedIncome = baseIncome + additionalIncome;
  const incrementedTax = calculateFederalTax(incrementedIncome, filingStatus);
  
  // Marginal rate is the additional tax divided by the increment
  return (incrementedTax - baseTax) / additionalIncome;
};

/**
 * Calculates the supplemental withholding rate that should be applied to bonuses and RSUs
 */
export const getSupplementalWithholdingRate = (annualIncome: number): number => {
  // For incomes over $1 million, the supplemental rate is 37%
  if (annualIncome > 1000000) {
    return 0.37;
  }
  // For most incomes, the supplemental rate is 22%
  return 0.22;
};

/**
 * Calculates the capital gains tax rate based on income and filing status
 */
export const getCapitalGainsTaxRate = (
  annualIncome: number, 
  filingStatus: string, 
  holdingPeriod: 'shortTerm' | 'longTerm'
): number => {
  // Short-term capital gains are taxed as ordinary income
  if (holdingPeriod === 'shortTerm') {
    const baseTax = calculateFederalTax(annualIncome, filingStatus);
    const incrementedTax = calculateFederalTax(annualIncome + 1000, filingStatus);
    return (incrementedTax - baseTax) / 1000; // Approximate marginal rate
  }
  
  // Long-term capital gains rates for 2025
  if (filingStatus === 'married') {
    if (annualIncome < 89250) return 0;
    if (annualIncome < 553850) return 0.15;
    return 0.20;
  } else if (filingStatus === 'single') {
    if (annualIncome < 44625) return 0;
    if (annualIncome < 492300) return 0.15;
    return 0.20;
  } else { // Head of household
    if (annualIncome < 59750) return 0;
    if (annualIncome < 523050) return 0.15;
    return 0.20;
  }
};

/**
 * Estimates K-1 tax liability based on income type and amount
 */
export const estimateK1TaxLiability = (
  baseIncome: number,
  k1Income: number,
  filingStatus: string,
  isQBI: boolean = true
): {
  federalTax: number;
  selfEmploymentTax: number;
  qbiDeduction: number;
  totalTax: number;
  effectiveRate: number;
} => {
  // Calculate QBI deduction (20% of qualified business income) if applicable
  const qbiDeduction = isQBI ? k1Income * 0.20 : 0;
  
  // Calculate federal income tax on K-1 income (after QBI deduction)
  const taxableK1Income = k1Income - qbiDeduction;
  const baseTax = calculateFederalTax(baseIncome, filingStatus);
  const combinedTax = calculateFederalTax(baseIncome + taxableK1Income, filingStatus);
  const federalTax = combinedTax - baseTax;
  
  // Calculate self-employment tax (15.3% on first $160,200, then 2.9% on remainder)
  // Note: Only applies to certain types of K-1 income (active partnership income)
  // This is a simplified calculation
  const selfEmploymentTaxBase = Math.min(k1Income, 160200);
  const selfEmploymentTaxRemainder = Math.max(0, k1Income - 160200);
  const selfEmploymentTax = (selfEmploymentTaxBase * 0.153) + (selfEmploymentTaxRemainder * 0.029);
  
  // Calculate total tax
  const totalTax = federalTax + selfEmploymentTax;
  
  // Calculate effective tax rate
  const effectiveRate = totalTax / k1Income;
  
  return {
    federalTax,
    selfEmploymentTax,
    qbiDeduction,
    totalTax,
    effectiveRate
  };
};

/**
 * Calculates the total tax impact of all special income items
 */
export const calculateTotalSpecialIncomeTaxImpact = (
  baseIncome: number,
  specialIncomeItems: SpecialIncomeItem[],
  filingStatus: string
): {
  totalAdditionalIncome: number;
  totalAdditionalTax: number;
  totalWithholding: number;
  netTaxDue: number;
  blendedEffectiveRate: number;
  itemizedImpacts: {
    itemType: string;
    amount: number;
    additionalTax: number;
    effectiveTaxRate: number;
  }[];
} => {
  // Calculate individual impacts
  const impacts = calculateSpecialIncomeTaxImpact(baseIncome, specialIncomeItems, filingStatus);
  
  // Calculate totals
  const totalAdditionalIncome = specialIncomeItems.reduce((sum, item) => sum + item.amount, 0);
  const totalAdditionalTax = impacts.reduce((sum, impact) => sum + impact.additionalTax, 0);
  const totalWithholding = specialIncomeItems.reduce((sum, item) => sum + item.withholding, 0);
  const netTaxDue = totalAdditionalTax - totalWithholding;
  
  // Calculate blended effective rate
  const blendedEffectiveRate = totalAdditionalIncome > 0 
    ? totalAdditionalTax / totalAdditionalIncome 
    : 0;
  
  // Create simplified itemized impacts for visualization
  const itemizedImpacts = impacts.map(impact => ({
    itemType: impact.itemType,
    amount: impact.amount,
    additionalTax: impact.additionalTax,
    effectiveTaxRate: impact.effectiveTaxRate
  }));
  
  return {
    totalAdditionalIncome,
    totalAdditionalTax,
    totalWithholding,
    netTaxDue,
    blendedEffectiveRate,
    itemizedImpacts
  };
};
