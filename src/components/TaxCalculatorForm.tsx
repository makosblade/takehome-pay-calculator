import { useState } from 'react';
import type { EnhancedCalculationInput, DualEarnerAnalysis } from '../types';
import { stateTaxRates, cityTaxRates } from '../data/taxData';
import SafeHarborCalculator from './SafeHarborCalculator';
import DualEarnerCalculator from './DualEarnerCalculator';
import FormInput from './FormInput';
import Card from './Card';
import Button from './Button';
import { validateTaxCalculatorForm } from '../services/validationService';
import { 
  handleNumericInputChange, 
  handleStateChange, 
  handlePayPeriodChange, 
  handleFilingStatusChange, 
  handlePayFrequencyChange 
} from '../services/formHandlerService';


interface TaxCalculatorFormProps {
  onCalculate: (values: EnhancedCalculationInput) => void;
}

const TaxCalculatorForm = ({ onCalculate }: TaxCalculatorFormProps) => {
  const [formData, setFormData] = useState<EnhancedCalculationInput>({
    grossIncome: 0,
    payPeriod: 'annual',
    state: '',
    city: '',
    district: '',
    filingStatus: 'single',
    priorYearTax: 0,
    currentYearWithholding: 0,
    payPeriodsRemaining: 0,
    payFrequency: 'biweekly',
    isSecondEarner: false,
    secondEarnerIncome: 0,
    secondEarnerWithholding: 0
  });
  
  const [errors, setErrors] = useState<{
    grossIncome?: string;
    state?: string;
    city?: string;
    payPeriod?: string;
    filingStatus?: string;
  }>({});
  
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showDualEarnerOptions, setShowDualEarnerOptions] = useState(false);
  const [dualEarnerAnalysis, setDualEarnerAnalysis] = useState<DualEarnerAnalysis | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Use formHandlerService for different input types
    if (name === 'grossIncome' || name === 'priorYearTax' || name === 'currentYearWithholding') {
      handleNumericInputChange(e as React.ChangeEvent<HTMLInputElement>, formData, setFormData, name);
    } else if (name === 'state') {
      handleStateChange(value, formData, setFormData);
    } else if (name === 'payPeriod') {
      handlePayPeriodChange(value, formData, setFormData);
    } else if (name === 'filingStatus') {
      handleFilingStatusChange(value, formData, setFormData);
    } else if (name === 'payFrequency') {
      handlePayFrequencyChange(value, formData, setFormData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Use validationService to validate form inputs
    const newErrors = validateTaxCalculatorForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Include dualEarnerAnalysis in the form data if available
      const dataToSubmit = dualEarnerAnalysis ? {
        ...formData,
        dualEarnerAnalysis: dualEarnerAnalysis
      } : formData;
      
      onCalculate(dataToSubmit);
    }
  };

  // Handle withholding plan updates
  const handleUpdateWithholding = (additionalWithholding: number) => {
    // This would typically update a W-4 form or similar
    // For now, we'll just update the formData
    setFormData({
      ...formData,
      currentYearWithholding: (formData.currentYearWithholding || 0) + 
        (additionalWithholding * (formData.payPeriodsRemaining || 0))
    });
  };
  
  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Income Information</h2>
        <FormInput
          label="Gross Income"
          name="grossIncome"
          type="number"
          value={formData.grossIncome}
          onChange={handleChange}
          placeholder="Enter your gross income"
          required
          error={errors.grossIncome}
          onlyNumbers
        />
        
        <FormInput
          label="Pay Period"
          name="payPeriod"
          type="select"
          value={formData.payPeriod}
          onChange={handleChange}
          required
          error={errors.payPeriod}
          options={[
            { value: 'annual', label: 'Annual' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'semiMonthly', label: 'Semi-Monthly (Twice a Month)' },
            { value: 'biweekly', label: 'Bi-Weekly (Every Two Weeks)' },
            { value: 'weekly', label: 'Weekly' }
          ]}
        />
        
        <FormInput
          label="Filing Status"
          name="filingStatus"
          type="select"
          value={formData.filingStatus}
          onChange={handleChange}
          required
          error={errors.filingStatus}
          options={[
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married Filing Jointly' },
            { value: 'headOfHousehold', label: 'Head of Household' }
          ]}
        />
        
        <FormInput
          label="State"
          name="state"
          type="select"
          value={formData.state}
          onChange={handleChange}
          required
          error={errors.state}
          options={[
            { value: '', label: 'Select state' },
            ...Object.keys(stateTaxRates).map(state => ({
              value: state,
              label: state
            }))
          ]}
        />
        
        {formData.state && (
          <FormInput
            label="City/Municipality"
            name="city"
            type="select"
            value={formData.city}
            onChange={handleChange}
            options={[
              { value: '', label: 'None' },
              ...Object.keys(cityTaxRates)
                .filter(cityName => cityTaxRates[cityName].state === formData.state)
                .map(cityName => ({
                  value: cityName,
                  label: cityName
                }))
            ]}
          />
        )}
        
        <FormInput
          label="District (if applicable)"
          name="district"
          type="text"
          value={formData.district || ''}
          onChange={handleChange}
          placeholder="Enter district (if applicable)"
        />
        
        <div className="mt-8 mb-4">
          <Button 
            type="button"
            variant="info"
            size="sm"
            className="text-blue-600 bg-transparent hover:bg-blue-50 flex items-center text-sm font-medium"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Tax Planning Options
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showAdvancedOptions ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
            </svg>
          </Button>
        </div>
        
        {showAdvancedOptions && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax Planning Options</h2>
            
            <div className="space-y-6">
              <FormInput
                label="Prior Year Total Tax (2024 Form 1040, Line 22)"
                name="priorYearTax"
                type="number"
                value={formData.priorYearTax || 0}
                onChange={handleChange}
                placeholder="Enter your 2024 total tax"
                onlyNumbers
                className="mb-1"
              />
              <p className="text-xs text-gray-500 mb-4">
                Used to calculate safe harbor requirements (110% of prior year tax for high earners)
              </p>
              
              <FormInput
                label="Current Year-to-Date Withholding"
                name="currentYearWithholding"
                type="number"
                value={formData.currentYearWithholding || 0}
                onChange={handleChange}
                placeholder="Enter your YTD withholding"
                onlyNumbers
                className="mb-1"
              />
              <p className="text-xs text-gray-500 mb-4">
                Total federal tax withheld so far this year (from your most recent pay stub)
              </p>
              
              <FormInput
                label="Pay Frequency"
                name="payFrequency"
                type="select"
                value={formData.payFrequency}
                onChange={handleChange}
                options={[
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'biweekly', label: 'Bi-weekly (Every Two Weeks)' },
                  { value: 'semiMonthly', label: 'Semi-Monthly (Twice a Month)' },
                  { value: 'monthly', label: 'Monthly' }
                ]}
                className="mb-1"
              />
              <p className="text-xs text-gray-500 mb-4">
                Used to calculate remaining pay periods in 2025
              </p>
              
              {formData.priorYearTax !== undefined && formData.priorYearTax > 0 && formData.grossIncome > 0 && (
                <SafeHarborCalculator
                  annualIncome={formData.payPeriod === 'annual' ? formData.grossIncome : formData.grossIncome * 12}
                  filingStatus={formData.filingStatus}
                  state={formData.state}
                  currentWithholding={formData.currentYearWithholding || 0}
                  onUpdateWithholding={handleUpdateWithholding}
                />
              )}
              
              <div className="mt-8 mb-4">
                <Button 
                  type="button"
                  variant="info"
                  size="sm"
                  className="text-blue-600 bg-transparent hover:bg-blue-50 flex items-center text-sm font-medium"
                  onClick={() => setShowDualEarnerOptions(!showDualEarnerOptions)}
                >
                  {showDualEarnerOptions ? 'Hide' : 'Show'} Dual Earner Household Options
                  <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={showDualEarnerOptions ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </Button>
              </div>
              
              {showDualEarnerOptions && formData.grossIncome > 0 && (
                <DualEarnerCalculator
                  primaryIncome={formData.payPeriod === 'annual' ? formData.grossIncome : formData.grossIncome * 12}
                  primaryWithholding={formData.currentYearWithholding || 0}
                  filingStatus={formData.filingStatus}
                  onSecondEarnerUpdate={(secondaryIncome, secondaryWithholding, analysis) => {
                    setFormData({
                      ...formData,
                      isSecondEarner: true,
                      secondEarnerIncome: secondaryIncome,
                      secondEarnerWithholding: secondaryWithholding
                    });
                    setDualEarnerAnalysis(analysis);
                    
                    // Update the form data with the analysis
                    setFormData({
                      ...formData,
                      dualEarnerAnalysis: analysis
                    });
                  }}
                />
              )}
            </div>
          </div>
        )}
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          className="mt-6"
        >
          Calculate Take-Home Pay
        </Button>
      </div>
      </form>
    </Card>
  );
};

export default TaxCalculatorForm;
