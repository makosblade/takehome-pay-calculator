import type { SpecialIncomeItem, AMTCalculation } from '../types';
import { calculateFederalTax } from './taxCalculationService';

/**
 * Calculates the tax implications of exercising Incentive Stock Options (ISOs)
 */
export const calculateISOTaxImplications = (
  baseIncome: number,
  isoDetails: SpecialIncomeItem,
  filingStatus: string
): {
  regularTaxAmount: number;
  amtAdjustment: number;
  amtTaxAmount: number;
  amtExposure: number;
  holdingPeriodRequirements: {
    qualifyingDispositionDate: Date;
    longTermCapitalGainsDate: Date;
  };
} => {
  // Calculate bargain element if not provided
  const bargainElement = isoDetails.bargainElement || 
    ((isoDetails.fairMarketValue || 0) - (isoDetails.exercisePrice || 0)) * (isoDetails.numberOfShares || 0);
  
  // For regular tax, ISO exercise is not a taxable event (unless it's a disqualifying disposition)
  let regularTaxAmount = 0;
  if (isoDetails.disqualifyingDisposition) {
    // For disqualifying dispositions, the bargain element is taxed as ordinary income
    const regularTaxWithoutISO = calculateFederalTax(baseIncome, filingStatus);
    const regularTaxWithISO = calculateFederalTax(baseIncome + bargainElement, filingStatus);
    regularTaxAmount = regularTaxWithISO - regularTaxWithoutISO;
  }
  
  // For AMT, the bargain element is an adjustment
  const amtAdjustment = bargainElement;
  
  // Calculate AMT tax on the adjustment
  const amtTaxAmount = calculateAMTTax(baseIncome, amtAdjustment, filingStatus);
  
  // AMT exposure is the additional tax due to AMT
  const amtExposure = Math.max(0, amtTaxAmount - regularTaxAmount);
  
  // Calculate holding period requirements for qualifying disposition
  const exerciseDate = isoDetails.date ? new Date(isoDetails.date) : new Date();
  const qualifyingDispositionDate = new Date(exerciseDate);
  qualifyingDispositionDate.setFullYear(qualifyingDispositionDate.getFullYear() + 1);
  qualifyingDispositionDate.setDate(qualifyingDispositionDate.getDate() + 1);
  
  const longTermCapitalGainsDate = new Date(exerciseDate);
  longTermCapitalGainsDate.setFullYear(longTermCapitalGainsDate.getFullYear() + 1);
  
  return {
    regularTaxAmount,
    amtAdjustment,
    amtTaxAmount,
    amtExposure,
    holdingPeriodRequirements: {
      qualifyingDispositionDate,
      longTermCapitalGainsDate
    }
  };
};

/**
 * Calculates the tax implications of exercising Non-Qualified Stock Options (NSOs)
 */
export const calculateNSOTaxImplications = (
  baseIncome: number,
  nsoDetails: SpecialIncomeItem,
  filingStatus: string
): {
  ordinaryIncomeTax: number;
  ficaTax: number;
  medicareTax: number;
  totalTaxLiability: number;
  effectiveTaxRate: number;
  withholding: number;
  withholdingShortfall: number;
} => {
  // Calculate bargain element if not provided
  const bargainElement = nsoDetails.bargainElement || 
    ((nsoDetails.fairMarketValue || 0) - (nsoDetails.exercisePrice || 0)) * (nsoDetails.numberOfShares || 0);
  
  // For NSOs, the bargain element is always taxed as ordinary income
  const regularTaxWithoutNSO = calculateFederalTax(baseIncome, filingStatus);
  const regularTaxWithNSO = calculateFederalTax(baseIncome + bargainElement, filingStatus);
  const ordinaryIncomeTax = regularTaxWithNSO - regularTaxWithoutNSO;
  
  // Calculate FICA tax (6.2% up to the wage base limit - $160,200 for 2023)
  const ficaWageBase = 160200; // Update this annually
  const ficaTaxWithoutNSO = Math.min(baseIncome, ficaWageBase) * 0.062;
  const ficaTaxWithNSO = Math.min(baseIncome + bargainElement, ficaWageBase) * 0.062;
  const ficaTax = ficaTaxWithNSO - ficaTaxWithoutNSO;
  
  // Calculate Medicare tax (1.45% on all earnings + 0.9% on earnings above threshold)
  const medicareTaxRate = 0.0145;
  const additionalMedicareTaxRate = 0.009;
  const additionalMedicareTaxThreshold = filingStatus === 'married' ? 250000 : 200000;
  
  let medicareTax = bargainElement * medicareTaxRate;
  
  // Add Additional Medicare Tax if applicable
  if (baseIncome > additionalMedicareTaxThreshold) {
    medicareTax += bargainElement * additionalMedicareTaxRate;
  } else if (baseIncome + bargainElement > additionalMedicareTaxThreshold) {
    const amountOverThreshold = baseIncome + bargainElement - additionalMedicareTaxThreshold;
    medicareTax += amountOverThreshold * additionalMedicareTaxRate;
  }
  
  // Calculate total tax liability
  const totalTaxLiability = ordinaryIncomeTax + ficaTax + medicareTax;
  
  // Calculate effective tax rate
  const effectiveTaxRate = totalTaxLiability / bargainElement;
  
  // Calculate withholding shortfall
  const withholding = nsoDetails.withholding || 0;
  const withholdingShortfall = Math.max(0, totalTaxLiability - withholding);
  
  return {
    ordinaryIncomeTax,
    ficaTax,
    medicareTax,
    totalTaxLiability,
    effectiveTaxRate,
    withholding,
    withholdingShortfall
  };
};

/**
 * Calculates Alternative Minimum Tax (AMT)
 */
export const calculateAMTTax = (
  baseIncome: number,
  amtAdjustments: number,
  filingStatus: string
): number => {
  // AMT exemption amounts for 2023
  const amtExemptionAmount = filingStatus === 'married' ? 126500 : 81300;
  const exemptionPhaseoutThreshold = filingStatus === 'married' ? 1156300 : 578150;
  
  // Calculate AMT income (AMTI)
  const amtIncome = baseIncome + amtAdjustments;
  
  // Calculate exemption reduction (25% of amount over threshold)
  let exemptionReduction = 0;
  if (amtIncome > exemptionPhaseoutThreshold) {
    exemptionReduction = (amtIncome - exemptionPhaseoutThreshold) * 0.25;
  }
  
  // Calculate final exemption amount
  const finalExemption = Math.max(0, amtExemptionAmount - exemptionReduction);
  
  // Calculate AMT base
  const amtBase = Math.max(0, amtIncome - finalExemption);
  
  // AMT rates: 26% up to $206,100 ($103,050 for MFS), 28% above
  const amtRateThreshold = filingStatus === 'married' ? 206100 : 103050;
  
  let amtTax = 0;
  if (amtBase <= amtRateThreshold) {
    amtTax = amtBase * 0.26;
  } else {
    amtTax = (amtRateThreshold * 0.26) + ((amtBase - amtRateThreshold) * 0.28);
  }
  
  return amtTax;
};

/**
 * Calculates full AMT details including regular tax comparison
 */
export const calculateFullAMT = (
  baseIncome: number,
  amtAdjustments: number,
  filingStatus: string
): AMTCalculation => {
  // Calculate regular tax
  const regularTaxLiability = calculateFederalTax(baseIncome, filingStatus);
  
  // Calculate AMT income
  const amtIncome = baseIncome + amtAdjustments;
  
  // AMT exemption amounts for 2023
  const amtExemptionAmount = filingStatus === 'married' ? 126500 : 81300;
  const exemptionPhaseoutThreshold = filingStatus === 'married' ? 1156300 : 578150;
  
  // Calculate exemption reduction (25% of amount over threshold)
  let exemptionReduction = 0;
  if (amtIncome > exemptionPhaseoutThreshold) {
    exemptionReduction = (amtIncome - exemptionPhaseoutThreshold) * 0.25;
  }
  
  // Calculate final exemption amount
  const amtExemption = Math.max(0, amtExemptionAmount - exemptionReduction);
  
  // Calculate AMT liability
  const amtLiability = calculateAMTTax(baseIncome, amtAdjustments, filingStatus);
  
  // Calculate AMT exposure (excess of AMT over regular tax)
  const amtExposure = Math.max(0, amtLiability - regularTaxLiability);
  
  return {
    regularTaxLiability,
    amtIncome,
    amtExemption,
    amtLiability,
    amtExposure
  };
};

/**
 * Generates an 83(b) election checklist
 */
export const generate83bElectionChecklist = (
  exerciseDate: Date
): {
  deadlineDate: Date;
  steps: Array<{
    step: string;
    description: string;
    deadline: Date | null;
    isRequired: boolean;
  }>;
} => {
  // 83(b) election must be filed within 30 days of exercise
  const deadlineDate = new Date(exerciseDate);
  deadlineDate.setDate(deadlineDate.getDate() + 30);
  
  // Create checklist steps
  const steps = [
    {
      step: "Complete 83(b) election form",
      description: "Fill out the 83(b) election form with your personal information, stock details, and valuation.",
      deadline: null,
      isRequired: true
    },
    {
      step: "Sign and date the election form",
      description: "Sign and date the completed 83(b) election form.",
      deadline: null,
      isRequired: true
    },
    {
      step: "Make three copies of the signed form",
      description: "Make three copies: one for the IRS, one for your employer, and one for your personal records.",
      deadline: null,
      isRequired: true
    },
    {
      step: "Mail the form to the IRS",
      description: "Mail the original signed form to the IRS office where you file your tax returns.",
      deadline: deadlineDate,
      isRequired: true
    },
    {
      step: "Send certified mail with return receipt",
      description: "Use certified mail with return receipt requested to prove timely filing.",
      deadline: deadlineDate,
      isRequired: false
    },
    {
      step: "Provide copy to employer",
      description: "Give a copy of the election to your employer for their records.",
      deadline: new Date(deadlineDate),
      isRequired: true
    },
    {
      step: "Attach copy to tax return",
      description: "Attach a copy to your tax return for the year of exercise.",
      deadline: null,
      isRequired: true
    }
  ];
  
  return {
    deadlineDate,
    steps
  };
};

/**
 * Determines if a stock option exercise is eligible for 83(b) election
 */
export const isEligibleFor83bElection = (
  optionType: 'iso' | 'nso',
  isUnvestedShares: boolean
): boolean => {
  // 83(b) elections are typically only relevant for unvested shares
  if (!isUnvestedShares) {
    return false;
  }
  
  // Both ISOs and NSOs can be eligible for 83(b) elections when exercising unvested shares
  return true;
};

/**
 * Calculates tax benefits of making an 83(b) election
 */
export const calculate83bElectionBenefits = (
  exercisePrice: number,
  currentFMV: number,
  estimatedFutureFMV: number,
  numberOfShares: number,
  marginalTaxRate: number
): {
  taxWithoutElection: number;
  taxWithElection: number;
  potentialSavings: number;
  riskOfLoss: number;
} => {
  // Without 83(b) election: pay tax on FMV - exercise price at vesting
  const bargainElementAtVesting = (estimatedFutureFMV - exercisePrice) * numberOfShares;
  const taxWithoutElection = bargainElementAtVesting * marginalTaxRate;
  
  // With 83(b) election: pay tax on FMV - exercise price at exercise
  const bargainElementAtExercise = (currentFMV - exercisePrice) * numberOfShares;
  const taxWithElection = bargainElementAtExercise * marginalTaxRate;
  
  // Potential tax savings
  const potentialSavings = taxWithoutElection - taxWithElection;
  
  // Risk of loss if shares become worthless
  const riskOfLoss = taxWithElection;
  
  return {
    taxWithoutElection,
    taxWithElection,
    potentialSavings,
    riskOfLoss
  };
};
