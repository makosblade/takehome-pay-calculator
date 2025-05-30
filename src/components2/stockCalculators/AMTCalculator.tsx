import React from 'react';
import InfoBox from '../../components/InfoBox';
import type { AMTCalculation } from '../../types';
import { formatCurrency } from '../../services/formattingService';

interface AMTCalculatorProps {
  amtCalculation: AMTCalculation;
}

/**
 * Component for displaying Alternative Minimum Tax (AMT) calculation details
 */
const AMTCalculator: React.FC<AMTCalculatorProps> = ({ amtCalculation }) => {
  return (
    <div className="space-y-4">
      <InfoBox title="Understanding AMT" variant="info">
        <p className="text-sm">
          Alternative Minimum Tax (AMT) is a parallel tax system designed to ensure that taxpayers with substantial income 
          cannot avoid taxation through deductions and credits. When exercising ISOs, the bargain element 
          (difference between FMV and exercise price) is an AMT adjustment, which can trigger AMT liability 
          even though it's not taxable for regular income tax purposes.
        </p>
        <p className="text-sm mt-2">
          <strong>AMT Credit:</strong> Any AMT paid due to ISO exercises may generate an AMT credit that can be used in future years
          when your regular tax exceeds your AMT.
        </p>
      </InfoBox>
      
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">AMT Calculation Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Regular Tax Liability</p>
            <p className="text-lg font-semibold">
              {formatCurrency(amtCalculation.regularTaxLiability)}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">AMT Income</p>
            <p className="text-lg font-semibold">
              {formatCurrency(amtCalculation.amtIncome)}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">AMT Exemption</p>
            <p className="text-lg font-semibold">
              {formatCurrency(amtCalculation.amtExemption)}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">AMT Liability</p>
            <p className="text-lg font-semibold">
              {formatCurrency(amtCalculation.amtLiability)}
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <p className="text-sm font-medium text-gray-500">AMT Exposure (Additional Tax)</p>
            <p className={`text-lg font-semibold ${amtCalculation.amtExposure > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {formatCurrency(amtCalculation.amtExposure)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AMTCalculator;
