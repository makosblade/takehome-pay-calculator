import React from 'react';
import type { EnhancedCalculationInput } from '../../types';
import { formatCurrency } from '../../services/formattingService';

interface IncomeSummaryProps {
  formData: EnhancedCalculationInput;
  primaryAnnualIncome: number;
  secondaryAnnualIncome: number;
  specialIncomeTotal: number;
  grandTotalIncome: number;
}

const IncomeSummary: React.FC<IncomeSummaryProps> = ({
  formData,
  primaryAnnualIncome,
  secondaryAnnualIncome,
  specialIncomeTotal,
  grandTotalIncome
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md mt-6">
      <h3 className="text-md font-medium text-gray-800 mb-3">Income Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Primary Annual Income:</span>
          <span className="font-medium">{formatCurrency(primaryAnnualIncome)}</span>
        </div>
        
        {formData.filingStatus === 'married' && formData.isSecondEarner && formData.secondEarnerIncome && (
          <div className="flex justify-between">
            <span className="text-gray-600">Secondary Annual Income:</span>
            <span className="font-medium">{formatCurrency(secondaryAnnualIncome)}</span>
          </div>
        )}
        
        {specialIncomeTotal > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Special Income Total:</span>
            <span className="font-medium">{formatCurrency(specialIncomeTotal)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 my-2"></div>
        
        <div className="flex justify-between font-medium">
          <span className="text-gray-900">Total Annual Income:</span>
          <span className="text-green-600">{formatCurrency(grandTotalIncome)}</span>
        </div>
      </div>
    </div>
  );
};

export default IncomeSummary;
