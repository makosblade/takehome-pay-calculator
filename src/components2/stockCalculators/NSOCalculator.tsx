import React, { useState, type ChangeEvent } from 'react';
import type { SpecialIncomeItem } from '../../types';
import FormInput from '../FormInput';
import { calculateNSOTaxImplications } from '../../services/stockOptionService';
import { formatCurrency, formatPercent } from '../../services/formattingService';
import InfoBox from '../../components/InfoBox';
import WizardButton from '../../components/WizardButton';

interface NSOCalculatorProps {
  baseIncome: number;
  filingStatus: string;
  onCalculate: (stockOption: SpecialIncomeItem, taxImplications: Record<string, number>) => void;
}

/**
 * Component for calculating tax implications of Non-Qualified Stock Options (NSOs)
 */
const NSOCalculator: React.FC<NSOCalculatorProps> = ({
  baseIncome,
  filingStatus,
  onCalculate
}) => {
  const [stockOption, setStockOption] = useState<SpecialIncomeItem>({
    type: 'nso',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    exercisePrice: 0,
    fairMarketValue: 0,
    numberOfShares: 0,
    withholding: 0,
    is83bElection: false
  });

  const [nsoTaxImplications, setNsoTaxImplications] = useState<Record<string, number> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'is83bElection') {
      setStockOption(prev => ({
        ...prev,
        is83bElection: value === 'yes'
      }));
    } else if (name === 'numberOfShares' || name === 'exercisePrice' || name === 'fairMarketValue' || name === 'withholding') {
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
    
    // Calculate NSO tax implications
    const implications = calculateNSOTaxImplications(
      baseIncome,
      stockOption,
      filingStatus
    );
    
    setNsoTaxImplications(implications);
    
    // Call the parent callback with the results
    onCalculate(stockOption, implications);
  };

  return (
    <div className="space-y-6">
      <InfoBox title="NSO Tax Information" variant="info">
        <p className="text-sm">
          Non-Qualified Stock Options (NSOs) are taxed as ordinary income at exercise on the bargain element 
          (difference between fair market value and exercise price). This income is also subject to FICA and 
          Medicare taxes. Employers typically withhold taxes, but you should verify the withholding is sufficient 
          to avoid underpayment penalties.
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
        
        <FormInput
          label="Tax Withholding Amount"
          name="withholding"
          type="number"
          value={stockOption.withholding || ''}
          onChange={handleInputChange}
          placeholder="Enter withholding amount"
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
      
      {nsoTaxImplications && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">NSO Tax Implications</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Bargain Element (Ordinary Income)</p>
              <p className="text-lg font-semibold">
                {formatCurrency(nsoTaxImplications.ordinaryIncome)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Income Tax</p>
              <p className="text-lg font-semibold">
                {formatCurrency(nsoTaxImplications.incomeTax)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">FICA Tax</p>
              <p className="text-lg font-semibold">
                {formatCurrency(nsoTaxImplications.ficaTax)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Medicare Tax</p>
              <p className="text-lg font-semibold">
                {formatCurrency(nsoTaxImplications.medicareTax)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Total Tax Liability</p>
              <p className="text-lg font-semibold">
                {formatCurrency(nsoTaxImplications.totalTaxLiability)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Effective Tax Rate</p>
              <p className="text-lg font-semibold">
                {formatPercent(nsoTaxImplications.effectiveTaxRate)}
              </p>
            </div>
            
            {stockOption.withholding > 0 && (
              <div className="col-span-1 md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Withholding Shortfall</p>
                <p className={`text-lg font-semibold ${nsoTaxImplications.withholdingShortfall > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatCurrency(nsoTaxImplications.withholdingShortfall)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <WizardButton 
          onClick={handleCalculate}
          variant="primary"
        >
          Calculate NSO Tax Impact
        </WizardButton>
      </div>
    </div>
  );
};

export default NSOCalculator;
