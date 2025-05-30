export interface TaxRates {
  federalRate: number;
  stateRate: number;
  cityRate: number;
  ficaRate: number;
  medicareRate: number;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface LocationData {
  state: string;
  city: string;
  district?: string;
}

export interface CalculationResult {
  grossIncome: number;
  federalTax: number;
  stateTax: number;
  cityTax: number;
  ficaTax: number;
  medicareTax: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
}

export interface CalculationInput {
  grossIncome: number;
  payPeriod: 'annual' | 'monthly' | 'semiMonthly' | 'biweekly' | 'weekly';
  state: string;
  city: string;
  district: string;
  filingStatus: 'single' | 'married' | 'marriedSeparate' | 'headOfHousehold';
}

/**
 * Safe Harbor calculation to determine if withholding meets IRS requirements
 */
export interface SafeHarborCalculation {
  priorYearTax: number;
  safeHarborAmount: number; // 110% of prior year tax for high earners
  currentWithholding: number;
  remainingWithholdingNeeded: number;
  isOnTrack: boolean;
}

/**
 * Withholding plan to reach safe harbor by year end
 */
export interface WithholdingPlan {
  payPeriodsRemaining: number;
  additionalWithholdingPerPeriod: number;
  currentPayPeriodWithholding: number;
  projectedAnnualWithholding: number;
  projectedShortfall: number;
}

/**
 * Special income items that may affect tax calculations
 */
export interface SpecialIncomeItem {
  type: 'bonus' | 'rsu' | 'capitalGains' | 'k1' | 'other' | 'iso' | 'nso';
  amount: number;
  withholding: number;
  date: string;
  description?: string;
  holdingPeriod?: 'shortTerm' | 'longTerm';
  isQBI?: boolean;
  // Stock option specific fields
  exercisePrice?: number;
  fairMarketValue?: number;
  numberOfShares?: number;
  is83bElection?: boolean;
  electionFilingDate?: string;
  disqualifyingDisposition?: boolean;
  bargainElement?: number; // Difference between FMV and exercise price
}

/**
 * Stock option exercise details for 83(b) elections and AMT calculations
 */
export interface StockExerciseDetails {
  exerciseDate: Date;
  saleDate?: Date;
  exercisePrice: number;
  fairMarketValue: number;
  salePrice?: number;
  numberOfShares: number;
  is83bElection: boolean;
  electionFilingDate?: Date;
}

/**
 * Tax impact of special income items
 */
export interface SpecialIncomeTaxImpact {
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
}

/**
 * Dual earner household analysis
 */
export interface DualEarnerAnalysis {
  primaryIncome: number;
  primaryWithholding: number;
  secondaryIncome: number;
  secondaryWithholding: number;
  combinedIncome: number;
  combinedWithholding: number;
  withholdingGap: number;
  recommendedW4Adjustment: number;
}

/**
 * Tax-advantaged account contribution tracking
 */
export interface TaxAdvantageAccounts {
  contribution401k: number;
  contributionHSA: number;
  contributionFSA: number;
  contributionDependentCareFSA: number;
  isCatchUpEligible: boolean; // Age 50+ for 401(k)
  maxContribution401k: number; // $23,000 base + $7,500 catch-up if eligible
  maxContributionHSA: number; // $8,300 family limit
  remainingContribution401k: number;
  remainingContributionHSA: number;
  taxSavings: number;
}

/**
 * AMT calculation details
 */
export interface AMTCalculation {
  regularTaxLiability: number;
  amtIncome: number;
  amtExemption: number;
  amtLiability: number;
  amtExposure: number; // Positive if AMT > regular tax
}

/**
 * Enhanced calculation input with all new features
 */
export interface EnhancedCalculationInput extends CalculationInput {
  // Safe harbor data
  priorYearTax?: number;
  currentYearWithholding?: number;
  payPeriodsRemaining?: number;
  payFrequency?: 'weekly' | 'biweekly' | 'semiMonthly' | 'monthly';
  
  // Dual earner data
  isSecondEarner?: boolean;
  secondEarnerIncome?: number;
  secondEarnerWithholding?: number;
  secondEarnerPayPeriod?: 'annual' | 'monthly' | 'semiMonthly' | 'biweekly' | 'weekly';
  secondEarnerPayFrequency?: 'weekly' | 'biweekly' | 'semiMonthly' | 'monthly';
  deductionAllocationPercentage?: number; // For married filing separately
  dualEarnerAnalysis?: DualEarnerAnalysis;
  
  // Special income data
  specialIncomeItems?: SpecialIncomeItem[];
  specialIncomeTaxImpact?: SpecialIncomeTaxImpact;
  
  // Stock options and 83(b)
  stockExerciseDetails?: StockExerciseDetails;
  
  // Tax-advantaged accounts
  taxAdvantageAccounts?: TaxAdvantageAccounts;
  
  // State-specific
  isCaliforniaResident?: boolean;
  
  // Quarterly estimated payments already made
  quarterlyPaymentsMade?: {
    quarter: 1 | 2 | 3 | 4;
    amount: number;
    date: Date;
  }[];
  
  // Charitable giving
  charitableGiving?: {
    currentYearGiving: number;
    plannedGiving: number;
    useDAF: boolean;
    otherItemizedDeductions: number;
  };
  
  // Capital gains/losses
  capitalGains?: {
    shortTerm: number; // Taxed as ordinary income
    longTerm: number; // Preferential tax rates
    carryoverLosses: number; // From previous years
    plannedSales: {
      assetType: string;
      costBasis: number;
      expectedValue: number;
      acquisitionDate: Date;
    }[];
  };
  
  // Current W-4 settings
  currentW4Settings?: {
    filingStatus: string;
    multipleJobs: boolean;
    claimDependents: number;
    otherIncome: number;
    deductions: number;
    extraWithholding: number;
  };
}

/**
 * Enhanced calculation result with all new features
 */
/**
 * Quarterly estimated tax payment information
 */
export interface QuarterlyEstimatedPayment {
  quarter: 1 | 2 | 3 | 4;
  dueDate: Date;
  suggestedPayment: number;
  paid: boolean;
  paidAmount?: number;
  paidDate?: Date;
}

/**
 * Tax planning timeline with key dates and actions
 */
export interface TaxPlanningTimeline {
  currentDate: Date;
  quarterlyPayments: QuarterlyEstimatedPayment[];
  w4DeadlineDate?: Date;
  endOfYearDate: Date;
  filingDeadline: Date;
  extensionDeadline: Date;
  keyMilestones: {
    date: Date;
    action: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
  }[];
}

/**
 * W-4 adjustment recommendations
 */
export interface W4Recommendation {
  filingStatus: 'single' | 'married' | 'headOfHousehold' | 'marriedWithholdAtHigher';
  additionalWithholding: number;
  adjustDependents: number;
  otherIncome: number;
  deductions: number;
  recommendedChanges: string[];
}

/**
 * Charitable giving strategy
 */
export interface CharitableGivingStrategy {
  standardDeduction: number;
  currentItemizedDeductions: number;
  suggestedBunchingAmount: number;
  potentialTaxSavings: number;
  useDAF: boolean; // Donor-advised fund
}

export interface EnhancedCalculationResult extends CalculationResult {
  // Safe harbor calculations
  safeHarborCalculation?: SafeHarborCalculation;
  californiaSafeHarborCalculation?: SafeHarborCalculation;
  withholdingPlan?: WithholdingPlan;
  
  // Dual earner analysis
  dualEarnerAnalysis?: DualEarnerAnalysis;
  
  // Special income impact
  specialIncomeImpact?: {
    itemType: string;
    additionalTax: number;
    effectiveTaxRate: number;
    withholdingShortfall: number;
  }[];
  
  // AMT calculations
  amtCalculation?: AMTCalculation;
  
  // Tax-advantaged account analysis
  taxAdvantageAccountsAnalysis?: {
    potentialTaxSavings: number;
    recommendedContributions: TaxAdvantageAccounts;
  };
  
  // State-specific calculations
  californiaSpecificResults?: {
    safeHarborPercentage: number; // 90% for CA vs 110% federal
    qbiDeductionAddBack: number; // CA doesn't allow §199A deduction
    stateTaxDeduction: number; // Limited to $10k on federal return
  };
  
  // Quarterly estimated payments
  quarterlyEstimatedPayments?: QuarterlyEstimatedPayment[];
  
  // Tax planning timeline
  taxPlanningTimeline?: TaxPlanningTimeline;
  
  // W-4 adjustment recommendations
  w4Recommendation?: W4Recommendation;
  
  // Charitable giving strategy
  charitableGivingStrategy?: CharitableGivingStrategy;
}
