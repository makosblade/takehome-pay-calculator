import React from 'react';
import type { EnhancedCalculationInput, CalculationResult } from '../../types';
import { formatCurrency } from '../../services/formattingService';

interface DualEarnerAnalysisProps {
  formData: EnhancedCalculationInput;
  calculationResult: CalculationResult;
}

const DualEarnerAnalysis: React.FC<DualEarnerAnalysisProps> = ({
  formData,
  calculationResult
}) => {
  // Wrapper for formatCurrency to handle undefined values
  const formatCurrencyValue = (amount: number | undefined): string => {
    if (amount === undefined) return '$0';
    return formatCurrency(amount, 0); // Use 0 decimal places for whole dollar amounts
  };
  
  // Calculate annual income based on pay period
  const calculateAnnualIncome = (income: number, payPeriod: string): number => {
    switch (payPeriod) {
      case 'monthly': return income * 12;
      case 'semiMonthly': return income * 24;
      case 'biweekly': return income * 26;
      case 'weekly': return income * 52;
      default: return income; // annual
    }
  };
  
  // Calculate total annual income
  const primaryAnnualIncome = calculateAnnualIncome(formData.grossIncome, formData.payPeriod);
  const secondaryAnnualIncome = formData.isSecondEarner 
    ? calculateAnnualIncome(formData.secondEarnerIncome || 0, formData.secondEarnerPayPeriod || formData.payPeriod) 
    : 0;
  const totalAnnualIncome = primaryAnnualIncome + secondaryAnnualIncome;

  return (
    <div className="mt-6 bg-purple-50 p-4 rounded-md">
      <h3 className="text-md font-medium text-purple-800 mb-3">Dual Earner Household Analysis</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-2">Income Distribution</h4>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Primary Income:</span>
              <span className="font-medium">{formatCurrencyValue(primaryAnnualIncome)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Secondary Income:</span>
              <span className="font-medium">{formatCurrencyValue(secondaryAnnualIncome)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Combined Income:</span>
              <span className="font-medium">{formatCurrencyValue(totalAnnualIncome)}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-purple-700 mb-2">Withholding Distribution</h4>
          <div className="bg-white p-3 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Primary Withholding:</span>
              <span className="font-medium">{formatCurrencyValue(formData.currentYearWithholding || 0)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Secondary Withholding:</span>
              <span className="font-medium">{formatCurrencyValue(formData.secondEarnerWithholding || 0)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between">
              <span className="text-gray-700 font-medium">Combined Withholding:</span>
              <span className="font-medium">
                {formatCurrencyValue((formData.currentYearWithholding || 0) + (formData.secondEarnerWithholding || 0))}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-purple-700 mt-4">
        For married couples filing jointly, your combined income places you in a
        {calculationResult.effectiveTaxRate > 0.25 ? ' higher' : ' lower'} tax bracket
        than if you were filing separately.
      </p>
    </div>
  );
};

export default DualEarnerAnalysis;
