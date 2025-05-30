import React from 'react';
import type { W4Recommendation } from '../types';
import Card from './Card';
import InfoBox from './InfoBox';
import { formatCurrency } from '../services/formattingService';

interface W4RecommendationUIProps {
  recommendation: W4Recommendation;
  primaryIncome: number;
  secondaryIncome: number;
  withholdingGap: number;
}

const W4RecommendationUI: React.FC<W4RecommendationUIProps> = ({
  recommendation,
  primaryIncome,
  secondaryIncome,
  withholdingGap
}) => {

  // Determine which earner is higher
  const isFirstEarnerHigher = primaryIncome >= secondaryIncome;
  const higherEarnerLabel = isFirstEarnerHigher ? 'Primary Earner' : 'Secondary Earner';
  const lowerEarnerLabel = isFirstEarnerHigher ? 'Secondary Earner' : 'Primary Earner';

  return (
    <Card className="mt-4" title="W-4 Adjustment Guide">
      <p className="text-sm text-gray-600 mb-4">
        Follow these recommendations to update your W-4 forms and avoid underwithholding.
      </p>

      <div className="space-y-6">
        <InfoBox 
          variant="info" 
          title={`${higherEarnerLabel}'s W-4 Form`}
        >
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 1: Filing Status</h4>
              <p className="text-sm text-gray-600">
                Select: <span className="font-medium">
                  {recommendation.filingStatus === 'married' ? 'Married filing jointly' : 
                   recommendation.filingStatus === 'marriedWithholdAtHigher' ? 'Married, but withhold at higher Single rate' :
                   recommendation.filingStatus === 'single' ? 'Single or Married filing separately' :
                   'Head of household'}
                </span>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 2: Multiple Jobs</h4>
              <p className="text-sm text-gray-600">
                {primaryIncome > 0 && secondaryIncome > 0 ? 
                  'Check the box in Step 2(c) for "Multiple Jobs or Spouse Works"' : 
                  'Leave this section blank'}
              </p>
            </div>
            
            {recommendation.adjustDependents > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Step 3: Claim Dependents</h4>
                <p className="text-sm text-gray-600">
                  Enter: <span className="font-medium">{formatCurrency(recommendation.adjustDependents)}</span>
                </p>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 4: Other Adjustments</h4>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {recommendation.otherIncome > 0 && (
                  <li>
                    4(a) Other income: <span className="font-medium">{formatCurrency(recommendation.otherIncome)}</span>
                  </li>
                )}
                {recommendation.deductions > 0 && (
                  <li>
                    4(b) Deductions: <span className="font-medium">{formatCurrency(recommendation.deductions)}</span>
                  </li>
                )}
                {recommendation.additionalWithholding > 0 && (
                  <li>
                    4(c) Extra withholding: <span className="font-medium">{formatCurrency(recommendation.additionalWithholding)}</span> per month
                    or <span className="font-medium">{formatCurrency(recommendation.additionalWithholding / 4)}</span> per week
                  </li>
                )}
              </ul>
            </div>
          </div>
        </InfoBox>
        
        <InfoBox 
          title={`${lowerEarnerLabel}'s W-4 Form`}
        >
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 1: Filing Status</h4>
              <p className="text-sm text-gray-600">
                Select: <span className="font-medium">
                  {withholdingGap > 5000 ? 'Married, but withhold at higher Single rate' : 'Married filing jointly'}
                </span>
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 2: Multiple Jobs</h4>
              <p className="text-sm text-gray-600">
                Leave this section blank (already accounted for on the higher earner's W-4)
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 3: Claim Dependents</h4>
              <p className="text-sm text-gray-600">
                Enter: <span className="font-medium">$0</span> (claim all dependents on the higher earner's W-4)
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700">Step 4: Other Adjustments</h4>
              <p className="text-sm text-gray-600">
                Leave all fields blank unless you need additional withholding beyond the recommendations above.
              </p>
            </div>
          </div>
        </InfoBox>
        
        <InfoBox 
          variant="warning" 
          title="Important Notes"
        >
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Submit your updated W-4 forms to your respective employers' HR or payroll departments.</li>
            <li>Changes typically take effect on the next payroll cycle.</li>
            <li>Review your withholding again if either spouse has a significant income change.</li>
            <li>These recommendations are based on your current income information and may need adjustment if your situation changes.</li>
          </ul>
        </InfoBox>
      </div>
    </Card>
  );
};

export default W4RecommendationUI;
