import React from 'react';
import type { EnhancedCalculationInput, CalculationResult } from '../../types';
import { formatCurrency } from '../../services/formattingService';

interface SafeHarborStatusProps {
  formData: EnhancedCalculationInput;
  calculationResult: CalculationResult;
}

const SafeHarborStatus: React.FC<SafeHarborStatusProps> = ({
  formData,
  calculationResult
}) => {
  // Wrapper for formatCurrency to handle undefined values
  const formatCurrencyValue = (amount: number | undefined): string => {
    if (amount === undefined) return '$0';
    return formatCurrency(amount, 0); // Use 0 decimal places for whole dollar amounts
  };

  // Calculate safe harbor amount (110% of prior year tax)
  const safeHarborAmount = (formData.priorYearTax || 0) * 1.1;
  
  // Calculate total withholding
  const totalWithholding = (formData.currentYearWithholding || 0) + 
    (formData.isSecondEarner ? (formData.secondEarnerWithholding || 0) : 0);
  
  // Determine if on track to meet safe harbor
  const isOnTrack = totalWithholding >= safeHarborAmount;
  
  // Calculate withholding gap
  const withholdingGap = isOnTrack ? 0 : safeHarborAmount - totalWithholding;

  return (
    <div className="mt-6 bg-blue-50 p-4 rounded-md">
      <h3 className="text-md font-medium text-blue-800 mb-3">Safe Harbor Status</h3>
      
      <div className="bg-white p-3 rounded shadow-sm">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Prior Year Tax:</span>
          <span className="font-medium">{formatCurrencyValue(formData.priorYearTax)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Safe Harbor Amount (110%):</span>
          <span className="font-medium">{formatCurrencyValue(safeHarborAmount)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Current Withholding:</span>
          <span className="font-medium">{formatCurrencyValue(totalWithholding)}</span>
        </div>
        <div className="border-t border-gray-200 my-2"></div>
        <div className="flex justify-between">
          <span className="text-gray-700 font-medium">Status:</span>
          <span className={`font-medium ${isOnTrack ? 'text-green-600' : 'text-red-600'}`}>
            {isOnTrack ? 'On Track' : `${formatCurrencyValue(withholdingGap)} Short`}
          </span>
        </div>
      </div>
      
      <p className="text-sm text-blue-700 mt-3">
        {isOnTrack 
          ? "You're on track to meet safe harbor requirements. This helps you avoid underpayment penalties."
          : `To meet safe harbor requirements and avoid underpayment penalties, you should withhold at least ${formatCurrencyValue(safeHarborAmount)} this year.`
        }
      </p>
    </div>
  );
};

export default SafeHarborStatus;
