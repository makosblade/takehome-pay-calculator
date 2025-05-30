import type { SafeHarborCalculation, WithholdingPlan } from '../types';

/**
 * Calculates federal safe harbor requirements based on prior year tax
 * For AGI > $150k (joint), safe harbor is 110% of prior year tax
 * For others, safe harbor is 100% of prior year tax
 */
export const calculateFederalSafeHarbor = (
  annualIncome: number, 
  priorYearTax: number, 
  currentWithholding: number,
  filingStatus: string
): SafeHarborCalculation => {
  // Safe harbor is 110% of prior year tax for high earners (>$150k)
  const isHighEarner = (filingStatus === 'married' && annualIncome > 150000) || 
                       (filingStatus !== 'married' && annualIncome > 75000);
  const safeHarborPercentage = isHighEarner ? 1.1 : 1.0;
  const safeHarborAmount = priorYearTax * safeHarborPercentage;
  
  return {
    priorYearTax,
    safeHarborAmount,
    currentWithholding,
    remainingWithholdingNeeded: Math.max(0, safeHarborAmount - currentWithholding),
    isOnTrack: currentWithholding >= safeHarborAmount
  };
};

/**
 * Calculates California safe harbor requirements (different from federal)
 * CA safe harbor is 90% of prior year tax
 */
export const calculateCaliforniaSafeHarbor = (
  _annualIncome: number,
  priorYearTax: number,
  currentWithholding: number,
  _filingStatus: string
): SafeHarborCalculation => {
  // CA safe harbor is 90% of prior year tax for all earners
  const safeHarborPercentage = 0.9;
  const safeHarborAmount = priorYearTax * safeHarborPercentage;
  
  return {
    priorYearTax,
    safeHarborAmount,
    currentWithholding,
    remainingWithholdingNeeded: Math.max(0, safeHarborAmount - currentWithholding),
    isOnTrack: currentWithholding >= safeHarborAmount
  };
};

/**
 * Creates a withholding plan to reach safe harbor
 */
export const createWithholdingPlan = (
  remainingWithholdingNeeded: number,
  payPeriodsRemaining: number,
  currentPayPeriodWithholding: number
): WithholdingPlan => {
  const additionalWithholdingPerPeriod = remainingWithholdingNeeded / payPeriodsRemaining;
  const projectedAnnualWithholding = currentPayPeriodWithholding * payPeriodsRemaining;
  
  return {
    payPeriodsRemaining,
    additionalWithholdingPerPeriod,
    currentPayPeriodWithholding,
    projectedAnnualWithholding,
    projectedShortfall: Math.max(0, remainingWithholdingNeeded - projectedAnnualWithholding)
  };
};

/**
 * Calculates the number of pay periods remaining in the year
 */
export const calculateRemainingPayPeriods = (
  payFrequency: 'weekly' | 'biweekly' | 'semiMonthly' | 'monthly',
  currentDate: Date = new Date()
): number => {
  const currentYear = currentDate.getFullYear();
  const endOfYear = new Date(currentYear, 11, 31); // December 31
  
  // Calculate days remaining in the year
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.ceil((endOfYear.getTime() - currentDate.getTime()) / millisecondsPerDay);
  
  // Calculate pay periods remaining based on frequency
  switch (payFrequency) {
    case 'weekly':
      return Math.ceil(daysRemaining / 7);
    case 'biweekly':
      return Math.ceil(daysRemaining / 14);
    case 'semiMonthly':
      return Math.ceil(daysRemaining / 15);
    case 'monthly':
      return Math.ceil(daysRemaining / 30);
    default:
      return 0;
  }
};

/**
 * Calculates the "no math" solution for withholding
 * Takes last year's total tax, increases by 10%, divides by remaining pay periods
 */
export const calculateNoMathSolution = (
  priorYearTax: number,
  payPeriodsRemaining: number,
  isHighEarner: boolean = true
): number => {
  const safeHarborMultiplier = isHighEarner ? 1.1 : 1.0;
  const totalWithholdingNeeded = priorYearTax * safeHarborMultiplier;
  return totalWithholdingNeeded / payPeriodsRemaining;
};

/**
 * Determines if a one-time catch-up withholding is needed for the last paycheck
 */
export const calculateYearEndCatchUp = (
  safeHarborAmount: number,
  projectedWithholding: number
): number => {
  return Math.max(0, safeHarborAmount - projectedWithholding);
};
