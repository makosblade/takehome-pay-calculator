import React from 'react';
import type { EnhancedCalculationInput, CalculationResult } from '../../types';
import { formatCurrency } from '../../services/formattingService';

interface IncomeBreakdownCardProps {
  formData: EnhancedCalculationInput;
  calculationResult: CalculationResult;
}

const IncomeBreakdownCard: React.FC<IncomeBreakdownCardProps> = ({
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
  
  // Calculate per-period amount based on annual amount
  const calculatePerPeriodAmount = (annualAmount: number, payPeriod: string): number => {
    switch (payPeriod) {
      case 'monthly': return annualAmount / 12;
      case 'semiMonthly': return annualAmount / 24;
      case 'biweekly': return annualAmount / 26;
      case 'weekly': return annualAmount / 52;
      default: return annualAmount; // annual
    }
  };
  
  // Get pay period name for display
  const getPayPeriodName = (): string => {
    switch (formData.payPeriod) {
      case 'monthly': return 'Monthly';
      case 'semiMonthly': return 'Semi-Monthly';
      case 'biweekly': return 'Bi-Weekly';
      case 'weekly': return 'Weekly';
      default: return 'Annual';
    }
  };
  
  // Calculate per-period net income
  const perPeriodNetIncome = calculatePerPeriodAmount(
    calculationResult.netIncome, 
    formData.payPeriod
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Income Breakdown</h3>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-md font-medium text-blue-800 mb-2">Take-Home Pay</h4>
          <div className="flex flex-col items-center">
            <span className="text-sm text-blue-600">{getPayPeriodName()} Take-Home Pay</span>
            <span className="text-3xl font-bold text-blue-700 my-2">
              {formatCurrencyValue(perPeriodNetIncome)}
            </span>
            <span className="text-sm text-blue-600">
              Annual: {formatCurrencyValue(calculationResult.netIncome)}
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Withholding Status</h4>
          <div className="bg-gray-100 p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Current Withholding:</span>
              <span className="font-medium">{formatCurrencyValue(formData.currentYearWithholding)}</span>
            </div>
            
            {formData.isSecondEarner && formData.secondEarnerWithholding !== undefined && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Spouse Withholding:</span>
                <span className="font-medium">{formatCurrencyValue(formData.secondEarnerWithholding)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">Projected Annual Tax:</span>
              <span className="font-medium">{formatCurrencyValue(calculationResult.totalTax)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeBreakdownCard;
