import React from 'react';
import type { EnhancedCalculationInput } from '../../types';
import FormInput from '../FormInput';

interface PrimaryIncomeSectionProps {
  formData: EnhancedCalculationInput;
  handleNumericChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handlePayPeriodChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  errors: {[key: string]: string};
}

const PrimaryIncomeSection: React.FC<PrimaryIncomeSectionProps> = ({
  formData,
  handleNumericChange,
  handlePayPeriodChange,
  errors
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <h3 className="text-md font-medium text-gray-800 mb-3">Primary Income</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Gross Income"
          name="grossIncome"
          type="number"
          value={formData.grossIncome || 0}
          onChange={handleNumericChange}
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
          onChange={handlePayPeriodChange}
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
      </div>
      
      <div className="mt-2">
        <FormInput
          label="Current Year-to-Date Withholding"
          name="currentYearWithholding"
          type="number"
          value={formData.currentYearWithholding || 0}
          onChange={handleNumericChange}
          placeholder="Enter YTD withholding"
          onlyNumbers
          helpText="Total federal tax withheld so far this year (from your most recent pay stub)"
        />
      </div>
    </div>
  );
};

export default PrimaryIncomeSection;
