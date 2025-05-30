import React from 'react';
import type { EnhancedCalculationInput } from '../../types';
import { formatPercent } from '../../services/formattingService';

interface MarriedSeparateAnalysisProps {
  formData: EnhancedCalculationInput;
}

const MarriedSeparateAnalysis: React.FC<MarriedSeparateAnalysisProps> = ({
  formData
}) => {
  // Wrapper for formatPercent to handle undefined values
  const formatPercentValue = (rate: number | undefined): string => {
    if (rate === undefined) return '0%';
    return formatPercent(rate, 1); // Use 1 decimal place for percentages
  };

  return (
    <div className="mt-6 bg-yellow-50 p-4 rounded-md">
      <h3 className="text-md font-medium text-yellow-800 mb-3">Married Filing Separately Analysis</h3>
      
      <div className="bg-white p-3 rounded shadow-sm">
        <h4 className="text-sm font-medium mb-2">Deduction Allocation</h4>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Your Allocation:</span>
          <span className="font-medium">{formatPercentValue(formData.deductionAllocationPercentage || 50)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Spouse's Allocation:</span>
          <span className="font-medium">{formatPercentValue(100 - (formData.deductionAllocationPercentage || 50))}</span>
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>When filing separately, certain tax benefits may be limited or unavailable:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Child tax credits must be claimed by only one spouse</li>
            <li>If one spouse itemizes, both must itemize</li>
            <li>IRA contribution deductions may be reduced</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MarriedSeparateAnalysis;
