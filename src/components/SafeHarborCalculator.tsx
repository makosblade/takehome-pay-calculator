import { useState, useEffect } from 'react';
import type { SafeHarborCalculation, WithholdingPlan } from '../types';
import { 
  calculateFederalSafeHarbor, 
  calculateCaliforniaSafeHarbor, 
  createWithholdingPlan,
  calculateRemainingPayPeriods,
  calculateNoMathSolution
} from '../services/safeHarborService';
import { formatCurrency } from '../services/formattingService';
import InfoBox from './InfoBox';
import KeyValuePair from './KeyValuePair';
import Button from './Button';

interface SafeHarborCalculatorProps {
  annualIncome: number;
  filingStatus: string;
  state: string;
  onUpdateWithholding?: (additionalWithholding: number) => void;
  currentWithholding?: number;
  priorYearTax: number;
  payFrequency?: 'weekly' | 'biweekly' | 'semiMonthly' | 'monthly';
  payPeriodsRemaining?: number;
}

const SafeHarborCalculator = ({ 
  annualIncome, 
  filingStatus, 
  state,
  onUpdateWithholding,
  currentWithholding = 0,
  priorYearTax,
  payFrequency = 'biweekly',
  payPeriodsRemaining
}: SafeHarborCalculatorProps) => {
  // Use the passed in payPeriodsRemaining or calculate it based on payFrequency
  const [calculatedPayPeriodsRemaining, setCalculatedPayPeriodsRemaining] = useState<number>(payPeriodsRemaining || 0);
  const [federalSafeHarbor, setFederalSafeHarbor] = useState<SafeHarborCalculation | null>(null);
  const [californiaSafeHarbor, setCaliforniaSafeHarbor] = useState<SafeHarborCalculation | null>(null);
  const [withholdingPlan, setWithholdingPlan] = useState<WithholdingPlan | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate remaining pay periods based on frequency if not provided
  useEffect(() => {
    if (payPeriodsRemaining === undefined) {
      const remaining = calculateRemainingPayPeriods(payFrequency);
      setCalculatedPayPeriodsRemaining(remaining);
    }
  }, [payFrequency, payPeriodsRemaining]);
  
  // Calculate safe harbor when prior year tax changes
  useEffect(() => {
    if (priorYearTax > 0) {
      const federal = calculateFederalSafeHarbor(
        annualIncome,
        priorYearTax,
        currentWithholding,
        filingStatus
      );
      setFederalSafeHarbor(federal);
      
      if (state === 'California') {
        const california = calculateCaliforniaSafeHarbor(
          annualIncome,
          priorYearTax,
          currentWithholding,
          filingStatus
        );
        setCaliforniaSafeHarbor(california);
      } else {
        setCaliforniaSafeHarbor(null);
      }
    }
  }, [priorYearTax, annualIncome, filingStatus, state, currentWithholding]);
  
  // Create withholding plan when safe harbor calculation changes
  useEffect(() => {
    if (federalSafeHarbor && (payPeriodsRemaining || calculatedPayPeriodsRemaining) > 0) {
      const periodsRemaining = payPeriodsRemaining || calculatedPayPeriodsRemaining;
      const plan = createWithholdingPlan(
        federalSafeHarbor.remainingWithholdingNeeded,
        periodsRemaining,
        currentWithholding / (26 - periodsRemaining) // Estimate current per-period withholding
      );
      setWithholdingPlan(plan);
    }
  }, [federalSafeHarbor, payPeriodsRemaining, calculatedPayPeriodsRemaining, currentWithholding]);
  
  // Prior year tax and pay frequency are now passed as props, so these handlers are no longer needed
  
  const handleNoMathSolution = () => {
    const periodsRemaining = payPeriodsRemaining || calculatedPayPeriodsRemaining;
    if (priorYearTax > 0 && periodsRemaining > 0 && onUpdateWithholding) {
      const isHighEarner = (filingStatus === 'married' && annualIncome > 150000) || 
                          (filingStatus !== 'married' && annualIncome > 75000);
      const additionalPerPeriod = calculateNoMathSolution(priorYearTax, periodsRemaining, isHighEarner);
      onUpdateWithholding(additionalPerPeriod);
    }
  };
  
  // Using formatCurrency from formattingService instead of local implementation
  
  return (
    <div>

    {/* <Card className="mt-6" title="Safe Harbor Calculator"> */}
      <h3 className="text-xl font-semibold mb-4">Safe Harbor Analysis</h3>
      <p className="text-sm text-gray-600 mb-4">
        Calculate your safe harbor requirements to avoid underpayment penalties.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prior Year Total Tax (2024 Form 1040, Line 22)
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
            {formatCurrency(priorYearTax)}
          </div>
          <p className="text-xs text-gray-500 mt-1">Using value from Tax Planning section</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pay Frequency
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
            {payFrequency === 'weekly' ? 'Weekly' :
             payFrequency === 'biweekly' ? 'Bi-weekly (Every Two Weeks)' :
             payFrequency === 'semiMonthly' ? 'Semi-Monthly (Twice a Month)' : 'Monthly'}
          </div>
          <p className="text-xs text-gray-500 mt-1">Using value from Basic Info section</p>
        </div>
        
        {federalSafeHarbor && (
          <InfoBox 
            title="Federal Safe Harbor Analysis" 
            variant="info" 
            className="mt-6"
          >
            <div className="space-y-2">
              <KeyValuePair 
                label="Prior Year Total Tax:" 
                value={formatCurrency(federalSafeHarbor.priorYearTax)} 
              />
              
              <KeyValuePair 
                label={`Safe Harbor Amount (${annualIncome > 150000 ? "110%" : "100%"}):`} 
                value={formatCurrency(federalSafeHarbor.safeHarborAmount)} 
              />
              
              <KeyValuePair 
                label="Current Withholding:" 
                value={formatCurrency(federalSafeHarbor.currentWithholding)} 
              />
              
              <KeyValuePair 
                label="Remaining Needed:" 
                value={formatCurrency(federalSafeHarbor.remainingWithholdingNeeded)} 
                isHighlighted={true}
                valueClassName={federalSafeHarbor.remainingWithholdingNeeded > 0 ? 'text-red-600' : 'text-green-600'}
              />
              
              <KeyValuePair 
                label="Status:" 
                value={federalSafeHarbor.isOnTrack ? 'On Track' : 'Action Needed'} 
                valueClassName={federalSafeHarbor.isOnTrack ? 'text-green-600' : 'text-red-600'}
              />
            </div>
            
            {!federalSafeHarbor.isOnTrack && withholdingPlan && (
              <InfoBox 
                title="Withholding Plan" 
                variant="info" 
                className="mt-4"
              >
                <p className="text-sm text-gray-700">
                  With {withholdingPlan.payPeriodsRemaining} pay periods remaining, you should withhold an additional{' '}
                  <span className="font-semibold">{formatCurrency(withholdingPlan.additionalWithholdingPerPeriod)}</span>{' '}
                  per pay period to reach safe harbor.
                </p>
                
                {onUpdateWithholding && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="mt-3"
                    onClick={handleNoMathSolution}
                  >
                    Apply No-Math Solution
                  </Button>
                )}
              </InfoBox>
            )}
          </InfoBox>
        )}
        
        {californiaSafeHarbor && (
          <InfoBox 
            title="California Safe Harbor Analysis" 
            variant="info" 
            className="mt-4"
          >
            <div className="space-y-2">
              <KeyValuePair 
                label="Prior Year Total Tax:" 
                value={formatCurrency(californiaSafeHarbor.priorYearTax)} 
              />
              
              <KeyValuePair 
                label="Safe Harbor Amount (90%):" 
                value={formatCurrency(californiaSafeHarbor.safeHarborAmount)} 
              />
              
              <KeyValuePair 
                label="Current Withholding:" 
                value={formatCurrency(californiaSafeHarbor.currentWithholding)} 
              />
              
              <KeyValuePair 
                label="Remaining Needed:" 
                value={formatCurrency(californiaSafeHarbor.remainingWithholdingNeeded)} 
                isHighlighted={true}
                valueClassName={californiaSafeHarbor.remainingWithholdingNeeded > 0 ? 'text-red-600' : 'text-green-600'}
              />
              
              <KeyValuePair 
                label="Status:" 
                value={californiaSafeHarbor.isOnTrack ? 'On Track' : 'Action Needed'} 
                valueClassName={californiaSafeHarbor.isOnTrack ? 'text-green-600' : 'text-red-600'}
              />
            </div>
          </InfoBox>
        )}
        
        <button 
          className="mt-2 text-sm text-blue-600 flex items-center"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide' : 'Show'} Details
          <svg 
            className="w-4 h-4 ml-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d={showDetails ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} 
            />
          </svg>
        </button>
        
        {showDetails && (
          <div className="mt-4 text-sm text-gray-600 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium text-gray-900 mb-2">Safe Harbor Rules</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Federal:</strong> For AGI over $150,000 (joint), you need to withhold at least 110% of your 
                prior year's total tax to avoid underpayment penalties. For AGI under $150,000, the threshold is 100%.
              </li>
              <li>
                <strong>California:</strong> CA requires 90% of prior-year tax for safe harbor (not 110%).
              </li>
              <li>
                <strong>No-Math Solution:</strong> Take last year's total tax, increase it by 10% (if AGI {">"}$150k), 
                divide by the number of remaining paychecks, and have payroll withhold that exact amount extra each pay period.
              </li>
              <li>
                <strong>Year-End Strategy:</strong> If you're behind in December, ask payroll to do a one-time catch-up 
                withholding on your last check.
              </li>
            </ul>
          </div>
        )}
      </div>
    {/* </Card> */}
    </div>
  );
};

export default SafeHarborCalculator;
