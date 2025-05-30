import { useState } from 'react';
import type { WithholdingPlan } from '../types';
import Card from './Card';
import InfoBox from './InfoBox';
import KeyValuePair from './KeyValuePair';
import Button from './Button';
import FormInput from './FormInput';
import { formatCurrency } from '../services/formattingService';

interface WithholdingPlanUIProps {
  withholdingPlan: WithholdingPlan;
  safeHarborAmount: number;
  onApplyPlan?: (additionalWithholding: number) => void;
}

const WithholdingPlanUI = ({ 
  withholdingPlan, 
  safeHarborAmount,
  onApplyPlan 
}: WithholdingPlanUIProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [customWithholding, setCustomWithholding] = useState<number>(
    Math.round(withholdingPlan.additionalWithholdingPerPeriod)
  );
  
  // Using formatCurrency from formattingService
  
  const handleCustomWithholdingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomWithholding(value ? parseInt(value) : 0);
  };
  
  const handleApplyCustomPlan = () => {
    if (onApplyPlan) {
      onApplyPlan(customWithholding);
    }
  };
  
  const handleApplyRecommendedPlan = () => {
    if (onApplyPlan) {
      onApplyPlan(withholdingPlan.additionalWithholdingPerPeriod);
    }
  };
  
  // Calculate projected total withholding with the additional amount
  const projectedTotalWithholding = 
    withholdingPlan.currentPayPeriodWithholding * (26 - withholdingPlan.payPeriodsRemaining) + 
    (withholdingPlan.currentPayPeriodWithholding + withholdingPlan.additionalWithholdingPerPeriod) * 
    withholdingPlan.payPeriodsRemaining;
  
  // Calculate if the plan meets safe harbor
  const meetsSafeHarbor = projectedTotalWithholding >= safeHarborAmount;
  
  // Calculate custom plan projected withholding
  const customPlanProjectedWithholding = 
    withholdingPlan.currentPayPeriodWithholding * (26 - withholdingPlan.payPeriodsRemaining) + 
    (withholdingPlan.currentPayPeriodWithholding + customWithholding) * 
    withholdingPlan.payPeriodsRemaining;
  
  // Check if custom plan meets safe harbor
  const customPlanMeetsSafeHarbor = customPlanProjectedWithholding >= safeHarborAmount;
  
  return (
    <Card className="mt-4" title="Withholding Plan">
      
      <div className="space-y-4">
        <InfoBox
          variant="info"
          title="Recommended Plan"
        >
          <div className="space-y-2">
            <KeyValuePair
              label="Pay Periods Remaining:"
              value={withholdingPlan.payPeriodsRemaining}
            />
            
            <KeyValuePair
              label="Current Per-Period Withholding:"
              value={formatCurrency(withholdingPlan.currentPayPeriodWithholding)}
            />
            
            <KeyValuePair
              label="Additional Withholding Needed Per Period:"
              value={formatCurrency(withholdingPlan.additionalWithholdingPerPeriod)}
              valueClassName="text-blue-700"
            />
            
            <KeyValuePair
              label="Projected Annual Withholding:"
              value={formatCurrency(projectedTotalWithholding)}
            />
            
            <KeyValuePair
              label="Safe Harbor Status:"
              value={meetsSafeHarbor ? "Will Meet Safe Harbor" : "Will Not Meet Safe Harbor"}
              valueClassName={meetsSafeHarbor ? "text-green-600" : "text-red-600"}
            />
          </div>
          
          {onApplyPlan && (
            <Button
              variant="primary"
              className="mt-3"
              onClick={handleApplyRecommendedPlan}
            >
              Apply Recommended Plan
            </Button>
          )}
        </InfoBox>
        
        <div className="mt-2">
          <button
            className="text-sm text-blue-600 flex items-center"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAdvancedOptions ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </button>
        </div>
        
        {showAdvancedOptions && (
          <InfoBox
            title="Custom Withholding Plan"
            className="mt-2"
          >
            <FormInput
              label="Custom Additional Withholding Per Period"
              name="customWithholding"
              type="text"
              value={customWithholding}
              onChange={(e) => handleCustomWithholdingChange(e as React.ChangeEvent<HTMLInputElement>)}
              onlyNumbers={true}
            />
            
            <div className="mt-3 space-y-2">
              <KeyValuePair
                label="Projected Annual Withholding:"
                value={formatCurrency(customPlanProjectedWithholding)}
              />
              
              <KeyValuePair
                label="Safe Harbor Status:"
                value={customPlanMeetsSafeHarbor ? "Will Meet Safe Harbor" : "Will Not Meet Safe Harbor"}
                valueClassName={customPlanMeetsSafeHarbor ? "text-green-600" : "text-red-600"}
              />
            </div>
            
            {onApplyPlan && (
              <Button
                variant="secondary"
                className="mt-3"
                onClick={handleApplyCustomPlan}
              >
                Apply Custom Plan
              </Button>
            )}
          </InfoBox>
        )}
        
        <InfoBox
          variant="warning"
          title="How to Update Your W-4"
          className="mt-4"
        >
          <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
            <li>Go to your employer's HR portal or payroll system</li>
            <li>Find the W-4 form or withholding adjustment section</li>
            <li>Enter the additional withholding amount in line 4(c) "Extra withholding"</li>
            <li>Submit the updated form to your payroll department</li>
          </ol>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Note:</strong> Changes typically take effect on the next payroll cycle. If you're close to year-end,
            you may need to request a one-time larger withholding adjustment.
          </p>
        </InfoBox>
      </div>
    </Card>
  );
};

export default WithholdingPlanUI;
