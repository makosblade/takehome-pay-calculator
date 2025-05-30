import React from 'react';
import type { EnhancedCalculationInput, CalculationResult } from '../../types';
import { formatCurrency } from '../../services/formattingService';

interface TaxPlanningRecommendationsProps {
  formData: EnhancedCalculationInput;
  calculationResult: CalculationResult;
}

const TaxPlanningRecommendations: React.FC<TaxPlanningRecommendationsProps> = ({
  formData,
  calculationResult
}) => {
  // Wrapper for formatCurrency to handle undefined values
  const formatCurrencyValue = (amount: number | undefined): string => {
    if (amount === undefined) return '$0';
    return formatCurrency(amount, 0); // Use 0 decimal places for whole dollar amounts
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg mt-6">
      <h3 className="text-lg font-medium text-green-800 mb-3">Tax Planning Recommendations</h3>
      
      <ul className="list-disc list-inside space-y-2 text-green-700">
        {formData.priorYearTax && formData.priorYearTax > 0 && (
          <li>
            Based on your prior year tax of {formatCurrencyValue(formData.priorYearTax)}, 
            you should withhold at least {formatCurrencyValue(formData.priorYearTax * 1.1)} 
            this year to meet safe harbor requirements.
          </li>
        )}
        
        {formData.taxAdvantageAccounts?.contribution401k !== undefined && (
          <li>
            Consider maximizing your 401(k) contributions to reduce your taxable income.
            {formData.taxAdvantageAccounts.isCatchUpEligible 
              ? " Since you're 50 or older, you can contribute up to $30,500 in 2025."
              : " You can contribute up to $23,000 in 2025."}
          </li>
        )}
        
        {formData.charitableGiving?.currentYearGiving !== undefined && (
          <li>
            Your charitable giving of {formatCurrencyValue(formData.charitableGiving.currentYearGiving)} 
            {formData.charitableGiving.plannedGiving ? 
              ` plus planned giving of ${formatCurrencyValue(formData.charitableGiving.plannedGiving)}` : 
              ''} 
            may provide tax benefits if you itemize deductions.
          </li>
        )}
        
        {calculationResult.effectiveTaxRate > 0.25 && (
          <li>
            Your effective tax rate of {(calculationResult.effectiveTaxRate * 100).toFixed(1)}% 
            is relatively high. Consider additional tax-advantaged investments or deductions.
          </li>
        )}
        
        {formData.filingStatus === 'married' && !formData.isSecondEarner && (
          <li>
            If your spouse has income, consider updating your tax information to include 
            their income for more accurate tax projections.
          </li>
        )}
        
        {formData.filingStatus === 'marriedSeparate' && (
          <li>
            When filing separately, review your allocation of deductions carefully to 
            optimize your combined tax situation.
          </li>
        )}
      </ul>
    </div>
  );
};

export default TaxPlanningRecommendations;
