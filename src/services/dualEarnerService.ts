import type { DualEarnerAnalysis, W4Recommendation } from '../types';
import { calculateFederalTax } from './taxCalculationService';

/**
 * Analyzes dual-earner household tax situation
 * Determines the withholding gap and recommends W-4 adjustments
 */
export const analyzeDualEarnerHousehold = (
  primaryIncome: number,
  primaryWithholding: number,
  secondaryIncome: number,
  secondaryWithholding: number,
  filingStatus: string
): DualEarnerAnalysis => {
  const combinedIncome = primaryIncome + secondaryIncome;
  const combinedWithholding = primaryWithholding + secondaryWithholding;
  
  // Calculate tax on combined income (married filing jointly)
  const combinedTax = calculateFederalTax(combinedIncome, filingStatus);
  
  // Calculate what withholding would be if each income was taxed separately
  // This simulates how payroll systems typically calculate withholding
  const primaryTaxIfSingle = calculateFederalTax(primaryIncome, 'single');
  const secondaryTaxIfSingle = calculateFederalTax(secondaryIncome, 'single');
  const separateWithholdingEstimate = primaryTaxIfSingle + secondaryTaxIfSingle;
  
  // Calculate withholding gap
  const withholdingGap = Math.max(0, combinedTax - separateWithholdingEstimate);
  
  // Recommend W4 adjustment for higher earner
  const recommendedW4Adjustment = withholdingGap > 0 ? Math.ceil(withholdingGap / 12) : 0;
  
  return {
    primaryIncome,
    primaryWithholding,
    secondaryIncome,
    secondaryWithholding,
    combinedIncome,
    combinedWithholding,
    withholdingGap,
    recommendedW4Adjustment
  };
};

/**
 * Creates W-4 adjustment recommendations for dual-earner households
 */
export const createW4Recommendations = (
  dualEarnerAnalysis: DualEarnerAnalysis,
  currentW4Settings?: {
    filingStatus: string;
    multipleJobs: boolean;
    claimDependents: number;
    otherIncome: number;
    deductions: number;
    extraWithholding: number;
  }
): W4Recommendation => {
  const { withholdingGap, recommendedW4Adjustment } = dualEarnerAnalysis;
  
  // Default recommendations
  const recommendations: string[] = [];
  
  // Determine if higher earner should check "Married filing jointly" or "Married, but withhold at higher Single rate"
  const filingStatus = withholdingGap > 5000 ? 'marriedWithholdAtHigher' : 'married';
  
  // Add recommendations based on analysis
  if (withholdingGap > 0) {
    recommendations.push(`Add $${recommendedW4Adjustment.toFixed(0)} additional withholding per month on line 4(c) of the higher earner's W-4.`);
  }
  
  if (withholdingGap > 5000) {
    recommendations.push("For the second earner, select 'Married, but withhold at higher Single rate' on the W-4 form.");
  }
  
  if (currentW4Settings?.multipleJobs === false && withholdingGap > 2000) {
    recommendations.push("Check the box in Step 2(c) for 'Multiple Jobs' on the higher earner's W-4.");
  }
  
  // Add general recommendation for dual earners
  recommendations.push("Consider turning off all allowances/credits on the second earner's W-4 to increase withholding.");
  
  return {
    filingStatus: filingStatus as 'single' | 'married' | 'headOfHousehold' | 'marriedWithholdAtHigher',
    additionalWithholding: recommendedW4Adjustment,
    adjustDependents: 0, // Default to no change
    otherIncome: 0, // Default to no change
    deductions: 0, // Default to no change
    recommendedChanges: recommendations
  };
};

/**
 * Calculates the impact of checking the "Multiple Jobs" checkbox on W-4
 */
export const calculateMultipleJobsImpact = (
  primaryIncome: number,
  secondaryIncome: number
): number => {
  // Simplified calculation of the impact of checking the "Multiple Jobs" box
  // This is a rough approximation - the actual IRS calculation is more complex
  const lowerIncome = Math.min(primaryIncome, secondaryIncome);
  const higherIncome = Math.max(primaryIncome, secondaryIncome);
  
  // Calculate additional withholding based on income tiers
  if (higherIncome > 150000) {
    return lowerIncome * 0.06; // Roughly 6% additional withholding
  } else if (higherIncome > 75000) {
    return lowerIncome * 0.04; // Roughly 4% additional withholding
  } else {
    return lowerIncome * 0.03; // Roughly 3% additional withholding
  }
};
