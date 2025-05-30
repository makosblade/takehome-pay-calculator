import React from 'react';
import type { EnhancedCalculationInput } from '../types';
import { stateTaxRates, cityTaxRates } from '../data/taxData';
import FormInput from './FormInput';

interface BasicInfoStepProps {
  formData: EnhancedCalculationInput;
  updateFormData: (data: Partial<EnhancedCalculationInput>, errors?: {[key: string]: string}) => void;
  errors: {[key: string]: string};
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  // Get help text for filing status
  const getFilingStatusHelpText = (status: string) => {
    switch(status) {
      case 'married':
        return "For couples who want to file one tax return. Often results in lower taxes.";
      case 'marriedSeparate':
        return "File separate returns. May benefit couples with significant separate deductions or income disparities.";
      case 'headOfHousehold':
        return "For unmarried individuals who pay more than half the cost of keeping up a home for a qualifying person.";
      default:
        return "For unmarried individuals with no dependents.";
    }
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'filingStatus') {
      // For married filing statuses, we need to handle second earner differently
      if (value === 'married') {
        // For married filing jointly, we'll ask if there's a second earner
        updateFormData({
          filingStatus: value as EnhancedCalculationInput['filingStatus'],
          // We don't automatically assume there's a second earner anymore
          isSecondEarner: false
        });
      } else if (value === 'marriedSeparate') {
        // For married filing separately, we need different handling
        updateFormData({
          filingStatus: value as EnhancedCalculationInput['filingStatus'],
          isSecondEarner: false,
          secondEarnerIncome: 0,
          secondEarnerWithholding: 0,
          deductionAllocationPercentage: 50 // Default to 50/50 split
        });
      } else {
        // For single or head of household
        updateFormData({
          filingStatus: value as EnhancedCalculationInput['filingStatus'],
          isSecondEarner: false,
          secondEarnerIncome: 0,
          secondEarnerWithholding: 0
        });
      }
    } else if (name === 'isSecondEarner') {
      // Handle the second earner checkbox
      updateFormData({
        isSecondEarner: value === 'true'
      });
    } else if (name === 'state') {
      // Reset city and district when state changes
      updateFormData({
        state: value,
        city: '',
        district: '',
        isCaliforniaResident: value === 'California'
      });
    } else {
      // Handle other field changes
      updateFormData({ [name]: value });
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
        <p className="text-sm text-gray-600 mt-1">
          Let's start with some basic information about your tax situation.
        </p>
      </div>
      
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
          { value: 'marriedSeparate', label: 'Married Filing Separately' },
          { value: 'headOfHousehold', label: 'Head of Household' }
        ]}
        helpText={getFilingStatusHelpText(formData.filingStatus)}
      />
      
      {/* Second Earner Checkbox - Only for Married Filing Jointly */}
      {formData.filingStatus === 'married' && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isSecondEarner"
              name="isSecondEarner"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={formData.isSecondEarner}
              onChange={(e) => handleChange({
                target: {
                  name: 'isSecondEarner',
                  value: e.target.checked ? 'true' : 'false'
                }
              } as React.ChangeEvent<HTMLInputElement>)}
            />
            <label htmlFor="isSecondEarner" className="ml-2 block text-sm text-gray-900">
              Does your household have two income earners?
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Check this if both you and your spouse have income that needs to be considered for tax calculations.
          </p>
        </div>
      )}
      
      <FormInput
        label="Pay Frequency"
        name="payFrequency"
        type="select"
        value={formData.payFrequency || 'biweekly'}
        onChange={handleChange}
        required
        error={errors.payFrequency}
        options={[
          { value: 'weekly', label: 'Weekly' },
          { value: 'biweekly', label: 'Bi-weekly (Every Two Weeks)' },
          { value: 'semiMonthly', label: 'Semi-Monthly (Twice a Month)' },
          { value: 'monthly', label: 'Monthly' }
        ]}
        helpText="This helps us calculate your remaining pay periods for the year."
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
          error={errors.city}
        />
      )}
      
      {formData.city && (
        <FormInput
          label="District (if applicable)"
          name="district"
          type="text"
          value={formData.district || ''}
          onChange={handleChange}
          placeholder="Enter district (if applicable)"
          error={errors.district}
        />
      )}
      
      {/* Special California-specific fields */}
      {formData.state === 'California' && (
        <div className="bg-blue-50 p-4 rounded-md mt-4">
          <h3 className="text-md font-medium text-blue-800 mb-2">California Specific Information</h3>
          <p className="text-sm text-blue-700 mb-3">
            California has special tax rules that may affect your withholding requirements.
          </p>
          
          {/* Add California-specific fields here if needed */}
        </div>
      )}
    </div>
  );
};

export default BasicInfoStep;
