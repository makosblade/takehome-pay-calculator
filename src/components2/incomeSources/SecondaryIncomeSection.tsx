import React from 'react';
import type { EnhancedCalculationInput } from '../../types';
import FormInput from '../FormInput';

interface SecondaryIncomeSectionProps {
  formData: EnhancedCalculationInput;
  handleNumericChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePayPeriodChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: {[key: string]: string};
}

const SecondaryIncomeSection: React.FC<SecondaryIncomeSectionProps> = ({
  formData,
  handleNumericChange,
  handlePayPeriodChange,
  errors
}) => {
  if (formData.filingStatus !== 'married' || !formData.isSecondEarner) {
    return null;
  }

  return (
    <div className="bg-purple-50 p-4 rounded-md mt-4">
      <h3 className="text-md font-medium text-purple-800 mb-3">Secondary Earner (Spouse)</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Gross Income"
          name="secondEarnerIncome"
          type="number"
          value={formData.secondEarnerIncome || 0}
          onChange={handleNumericChange}
          placeholder="Enter spouse's gross income"
          required={formData.isSecondEarner}
          error={errors.secondEarnerIncome}
          onlyNumbers
        />
        
        <FormInput
          label="Current Year-to-Date Withholding"
          name="secondEarnerWithholding"
          type="number"
          value={formData.secondEarnerWithholding || 0}
          onChange={handleNumericChange}
          placeholder="Enter spouse's YTD withholding"
          onlyNumbers
          helpText="Total federal tax withheld so far this year"
        />
      </div>
      
      <div className="mt-4">
        <FormInput
          label="Secondary Earner Pay Period"
          name="secondEarnerPayPeriod"
          type="select"
          value={formData.secondEarnerPayPeriod || formData.payPeriod}
          onChange={handlePayPeriodChange}
          options={[
            { value: 'annual', label: 'Annual' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'semiMonthly', label: 'Semi-Monthly (Twice a Month)' },
            { value: 'biweekly', label: 'Bi-Weekly (Every Two Weeks)' },
            { value: 'weekly', label: 'Weekly' }
          ]}
          helpText="Select the pay period for the secondary earner"
        />
      </div>
    </div>
  );
};

export default SecondaryIncomeSection;
