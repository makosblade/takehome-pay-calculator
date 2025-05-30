import React from 'react';
import type { EnhancedCalculationInput, CalculationResult } from '../../types';
import { formatCurrency, formatPercent } from '../../services/formattingService';

interface TaxSummaryCardProps {
  formData: EnhancedCalculationInput;
  calculationResult: CalculationResult;
}

const TaxSummaryCard: React.FC<TaxSummaryCardProps> = ({
  formData,
  calculationResult
}) => {
  // Wrapper for formatCurrency to handle undefined values
  const formatCurrencyValue = (amount: number | undefined): string => {
    if (amount === undefined) return '$0';
    return formatCurrency(amount, 0); // Use 0 decimal places for whole dollar amounts
  };

  // Wrapper for formatPercent to handle undefined values
  const formatPercentValue = (rate: number | undefined): string => {
    if (rate === undefined) return '0%';
    return formatPercent(rate, 1); // Use 1 decimal place for percentages
  };

  // Get filing status display text
  const getFilingStatusText = (status: string): string => {
    switch (status) {
      case 'married': return 'Married Filing Jointly';
      case 'marriedSeparate': return 'Married Filing Separately';
      case 'headOfHousehold': return 'Head of Household';
      default: return 'Single';
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Tax Summary</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Tax Breakdown</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Gross Income:</span>
              <span className="font-medium">{formatCurrencyValue(calculationResult.grossIncome)}</span>
            </div>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Federal Tax:</span>
              <span className="font-medium text-red-600">-{formatCurrencyValue(calculationResult.federalTax)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">State Tax:</span>
              <span className="font-medium text-red-600">-{formatCurrencyValue(calculationResult.stateTax)}</span>
            </div>
            
            {calculationResult.cityTax > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">City/Local Tax:</span>
                <span className="font-medium text-red-600">-{formatCurrencyValue(calculationResult.cityTax)}</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span className="text-gray-600">FICA (Social Security):</span>
              <span className="font-medium text-red-600">-{formatCurrencyValue(calculationResult.ficaTax)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Medicare:</span>
              <span className="font-medium text-red-600">-{formatCurrencyValue(calculationResult.medicareTax)}</span>
            </div>
            
            <div className="border-t border-gray-200 my-2"></div>
            
            <div className="flex justify-between font-medium">
              <span className="text-gray-900">Net Income:</span>
              <span className="text-green-600">{formatCurrencyValue(calculationResult.netIncome)}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Tax Metrics</h4>
          <div className="bg-gray-100 p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Total Tax:</span>
              <span className="font-medium">{formatCurrencyValue(calculationResult.totalTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Effective Tax Rate:</span>
              <span className="font-medium">{formatPercentValue(calculationResult.effectiveTaxRate)}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-2">Filing Information</h4>
          <div className="bg-gray-100 p-3 rounded">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Filing Status:</span>
              <span className="font-medium">{getFilingStatusText(formData.filingStatus)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">
                {formData.state}{formData.city ? `, ${formData.city}` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxSummaryCard;
