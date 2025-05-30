import React, { useState, type ChangeEvent } from 'react';
import FormInput from '../FormInput';
import type { SpecialIncomeItem } from '../../types';
import type { AMTCalculation } from '../../types';
import InfoBox from '../../components/InfoBox';
import { calculateFullAMT, calculateISOTaxImplications } from '../../services/stockOptionService';
import { formatCurrency } from '../../services/formattingService';
import WizardButton from '../../components/WizardButton';

interface ISOCalculatorProps {
  baseIncome: number;
  filingStatus: string;
  onCalculate: (stockOption: SpecialIncomeItem, amtCalculation: AMTCalculation) => void;
}

/**
 * Component for calculating tax implications of Incentive Stock Options (ISOs)
 */
const ISOCalculator: React.FC<ISOCalculatorProps> = ({
  baseIncome,
  filingStatus,
  onCalculate
}) => {
  const [stockOption, setStockOption] = useState<SpecialIncomeItem>({
    type: 'iso',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    exercisePrice: 0,
    fairMarketValue: 0,
    numberOfShares: 0,
    withholding: 0,
    is83bElection: false
  });

  // Store AMT calculation for passing to parent component
  const [, setAmtCalculation] = useState<AMTCalculation | null>(null);
  // Store ISO tax implications for display
  const [isoTaxImplications, setIsoTaxImplications] = useState<{
    regularIncomeTax: number;
    amtAdjustment: number;
    amtTax: number;
    amtExposure: number;
    additionalTaxDueToAMT: number;
    holdingPeriodRequirements?: {
      qualifyingDispositionDate: Date;
      longTermCapitalGainsDate: Date;
    };
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'is83bElection') {
      setStockOption(prev => ({
        ...prev,
        is83bElection: value === 'yes'
      }));
    } else if (name === 'numberOfShares' || name === 'exercisePrice' || name === 'fairMarketValue') {
      const numValue = parseFloat(value);
      setStockOption(prev => {
        // Calculate bargain element
        const bargainElement = name === 'numberOfShares' && !isNaN(numValue) 
          ? ((prev.fairMarketValue || 0) - (prev.exercisePrice || 0)) * numValue
          : name === 'exercisePrice' && !isNaN(numValue)
          ? ((prev.fairMarketValue || 0) - numValue) * (prev.numberOfShares || 0)
          : name === 'fairMarketValue' && !isNaN(numValue)
          ? (numValue - (prev.exercisePrice || 0)) * (prev.numberOfShares || 0)
          : ((prev.fairMarketValue || 0) - (prev.exercisePrice || 0)) * (prev.numberOfShares || 0);
          
        return {
          ...prev,
          [name]: isNaN(numValue) ? 0 : numValue,
          amount: Math.max(0, bargainElement) // Ensure amount is not negative
        };
      });
    } else {
      setStockOption(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!stockOption.exercisePrice) {
      newErrors.exercisePrice = 'Exercise price is required';
    }
    
    if (!stockOption.fairMarketValue) {
      newErrors.fairMarketValue = 'Fair market value is required';
    }
    
    if (!stockOption.numberOfShares) {
      newErrors.numberOfShares = 'Number of shares is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCalculate = () => {
    if (!validateInputs()) {
      return;
    }
    
    // Calculate ISO tax implications
    const implications = calculateISOTaxImplications(
      baseIncome,
      stockOption,
      filingStatus
    );
    
    // Map the returned values to our state format
    setIsoTaxImplications({
      regularIncomeTax: implications.regularTaxAmount,
      amtAdjustment: implications.amtAdjustment,
      amtTax: implications.amtTaxAmount,
      amtExposure: implications.amtExposure,
      additionalTaxDueToAMT: implications.amtExposure,
      holdingPeriodRequirements: implications.holdingPeriodRequirements
    });
    
    // Calculate AMT
    const amt = calculateFullAMT(
      baseIncome,
      implications.amtAdjustment,
      filingStatus
    );
    
    setAmtCalculation(amt);
    
    // Call the parent callback with the results
    onCalculate(stockOption, amt);
  };

  return (
    <div className="space-y-6">
      <InfoBox title="ISO Tax Information" variant="info">
        <p className="text-sm">
          Incentive Stock Options (ISOs) receive favorable tax treatment. There is no regular income tax at exercise,
          but the bargain element (difference between FMV and exercise price) is an adjustment for Alternative Minimum Tax (AMT) purposes.
        </p>
      </InfoBox>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Exercise Price Per Share"
          name="exercisePrice"
          type="number"
          value={stockOption.exercisePrice || ''}
          onChange={handleInputChange}
          placeholder="Enter exercise price"
          error={errors.exercisePrice}
          required
        />
        
        <FormInput
          label="Fair Market Value Per Share"
          name="fairMarketValue"
          type="number"
          value={stockOption.fairMarketValue || ''}
          onChange={handleInputChange}
          placeholder="Enter fair market value"
          error={errors.fairMarketValue}
          required
        />
        
        <FormInput
          label="Number of Shares"
          name="numberOfShares"
          type="number"
          value={stockOption.numberOfShares || ''}
          onChange={handleInputChange}
          placeholder="Enter number of shares"
          error={errors.numberOfShares}
          required
        />
        
        <FormInput
          label="Exercise Date"
          name="date"
          type="text"
          value={stockOption.date}
          onChange={handleInputChange}
          placeholder="YYYY-MM-DD"
        />
        
        <div className="col-span-1 md:col-span-2">
          <FormInput
            label="83(b) Election"
            name="is83bElection"
            type="select"
            value={stockOption.is83bElection ? 'yes' : 'no'}
            onChange={handleInputChange}
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' }
            ]}
          />
        </div>
      </div>
      
      {isoTaxImplications && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">ISO Tax Implications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Bargain Element</p>
              <p className="text-lg font-semibold">
                {formatCurrency(isoTaxImplications.amtAdjustment)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Regular Income Tax</p>
              <p className="text-lg font-semibold">
                {formatCurrency(isoTaxImplications.regularIncomeTax)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">AMT Adjustment</p>
              <p className="text-lg font-semibold">
                {formatCurrency(isoTaxImplications.amtAdjustment)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">AMT Tax</p>
              <p className="text-lg font-semibold">
                {formatCurrency(isoTaxImplications.amtTax)}
              </p>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium text-gray-500">Additional Tax Due to AMT</p>
              <p className={`text-lg font-semibold ${isoTaxImplications.additionalTaxDueToAMT > 0 ? 'text-red-600' : ''}`}>
                {formatCurrency(isoTaxImplications.additionalTaxDueToAMT)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <WizardButton 
          onClick={handleCalculate}
          variant="primary"
        >
          Calculate ISO Tax Impact
        </WizardButton>
      </div>
    </div>
  );
};

export default ISOCalculator;
