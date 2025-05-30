import React from 'react';
import type { EnhancedCalculationInput, TaxAdvantageAccounts } from '../types';
import FormInput from './FormInput';
import SafeHarborCalculator from '../components/SafeHarborCalculator';

interface TaxPlanningStepProps {
  formData: EnhancedCalculationInput;
  updateFormData: (data: Partial<EnhancedCalculationInput>, errors?: {[key: string]: string}) => void;
  errors: {[key: string]: string};
}

const TaxPlanningStep: React.FC<TaxPlanningStepProps> = ({
  formData,
  updateFormData,
  errors // Used for validation display
}) => {
  // Handle numeric input changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const { name, value } = e.target;
      const numericValue = value.replace(/[^0-9]/g, '');
      
      updateFormData({
        [name]: numericValue ? parseInt(numericValue) : 0
      });
    }
  };
  
  // Handle range input changes
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const { name, value } = e.target;
      updateFormData({
        [name]: parseInt(value)
      });
    }
  };
  
  // Handle withholding plan updates
  const handleUpdateWithholding = (additionalWithholding: number) => {
    updateFormData({
      currentYearWithholding: (formData.currentYearWithholding || 0) + 
        (additionalWithholding * (formData.payPeriodsRemaining || 0))
    });
  };
  
  // Calculate annual income based on pay period
  const calculateAnnualIncome = (income: number, payPeriod: string): number => {
    switch (payPeriod) {
      case 'monthly': return income * 12;
      case 'semiMonthly': return income * 24;
      case 'biweekly': return income * 26;
      case 'weekly': return income * 52;
      default: return income; // annual
    }
  };
  
  // Calculate total annual income
  const primaryAnnualIncome = calculateAnnualIncome(formData.grossIncome, formData.payPeriod);
  const secondaryAnnualIncome = formData.isSecondEarner 
    ? calculateAnnualIncome(formData.secondEarnerIncome || 0, formData.payPeriod) 
    : 0;
  const totalAnnualIncome = primaryAnnualIncome + secondaryAnnualIncome;
  
  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Tax Planning</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter information to help plan your tax withholding and avoid penalties.
        </p>
      </div>
      
      <div className="space-y-6">
        <FormInput
          label="Prior Year Total Tax (2024 Form 1040, Line 22)"
          name="priorYearTax"
          type="number"
          value={formData.priorYearTax || 0}
          onChange={handleNumericChange}
          placeholder="Enter your 2024 total tax"
          onlyNumbers
          className="mb-1"
          helpText="Used to calculate safe harbor requirements (110% of prior year tax for high earners)"
        />
        
        {formData.filingStatus === 'married' && (
          <div className="bg-purple-50 p-4 rounded-md">
            <h3 className="text-md font-medium text-purple-800 mb-3">Household Withholding Summary</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Earner Withholding:</span>
                <span className="font-medium">{formatCurrency(formData.currentYearWithholding || 0)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Secondary Earner Withholding:</span>
                <span className="font-medium">{formatCurrency(formData.secondEarnerWithholding || 0)}</span>
              </div>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Total Household Withholding:</span>
                <span className="text-green-600">
                  {formatCurrency((formData.currentYearWithholding || 0) + (formData.secondEarnerWithholding || 0))}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-purple-700 mt-3">
              For married couples, your combined withholding is what matters for tax purposes.
            </p>
          </div>
        )}
        
        {/* Remaining Pay Periods Display */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-md font-medium text-gray-800 mb-3">Remaining Pay Periods in 2025</h3>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Pay Frequency:</span>
            <span className="font-medium">
              {formData.payFrequency === 'weekly' ? 'Weekly' :
               formData.payFrequency === 'biweekly' ? 'Bi-weekly' :
               formData.payFrequency === 'semiMonthly' ? 'Semi-Monthly' : 'Monthly'}
            </span>
          </div>
          
          <div className="flex justify-between mt-2">
            <span className="text-gray-600">Remaining Pay Periods:</span>
            <span className="font-medium">{formData.payPeriodsRemaining || 0}</span>
          </div>
        </div>
        
        {/* Safe Harbor Calculator */}
        {formData.priorYearTax !== undefined && 
         formData.priorYearTax > 0 && 
         totalAnnualIncome > 0 && (
          // <div className="mt-6">
            // <h3 className="text-md font-medium text-gray-800 mb-3">Safe Harbor Analysis</h3>
            
            <SafeHarborCalculator
              annualIncome={totalAnnualIncome}
              filingStatus={formData.filingStatus}
              state={formData.state}
              currentWithholding={(formData.currentYearWithholding || 0) + (formData.secondEarnerWithholding || 0)}
              onUpdateWithholding={handleUpdateWithholding}
              priorYearTax={formData.priorYearTax || 0}
              payFrequency={formData.payFrequency}
              payPeriodsRemaining={formData.payPeriodsRemaining}
            />
          // </div>
        )}
        
        {/* Married Filing Separately - Deduction Allocation Section */}
        {formData.filingStatus === 'marriedSeparate' && (
          <div className="bg-yellow-50 p-4 rounded-md mt-6">
            <h3 className="text-md font-medium text-yellow-800 mb-3">Expense Allocation</h3>
            <p className="text-sm text-yellow-700 mb-3">
              When filing separately, specify how shared deductions are split between you and your spouse.
            </p>
            
            <div className="mb-4">
              <label htmlFor="deductionAllocationPercentage" className="block text-sm font-medium text-gray-700 mb-1">
                Percentage of Shared Deductions (Primary Filer): {formData.deductionAllocationPercentage || 50}%
              </label>
              <input
                type="range"
                id="deductionAllocationPercentage"
                name="deductionAllocationPercentage"
                min="0"
                max="100"
                step="5"
                value={formData.deductionAllocationPercentage || 50}
                onChange={handleRangeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Primary: {formData.deductionAllocationPercentage || 50}%, Secondary: {100 - (formData.deductionAllocationPercentage || 50)}%
              </p>
            </div>
            
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Allocation Impact</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded">
                  <p className="font-medium text-blue-800">Primary Filer</p>
                  <p className="text-blue-700">{formData.deductionAllocationPercentage || 50}% of deductions</p>
                </div>
                <div className="bg-purple-50 p-2 rounded">
                  <p className="font-medium text-purple-800">Secondary Filer</p>
                  <p className="text-purple-700">{100 - (formData.deductionAllocationPercentage || 50)}% of deductions</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Tax-Advantaged Accounts Section */}
        <div className="bg-green-50 p-4 rounded-md mt-6">
          <h3 className="text-md font-medium text-green-800 mb-3">Tax-Advantaged Accounts</h3>
          
          <p className="text-sm text-green-700 mb-4">
            Maximize your tax savings by contributing to tax-advantaged accounts.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="401(k) Contributions YTD"
              name="contribution401k"
              type="number"
              value={formData.taxAdvantageAccounts?.contribution401k || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                updateFormData({
                  taxAdvantageAccounts: {
                    ...(formData.taxAdvantageAccounts || {} as TaxAdvantageAccounts),
                    contribution401k: value ? parseInt(value) : 0
                  } as TaxAdvantageAccounts
                });
              }}
              placeholder="Enter 401(k) contributions"
              onlyNumbers
            />
            
            <FormInput
              label="HSA Contributions YTD"
              name="contributionHSA"
              type="number"
              value={formData.taxAdvantageAccounts?.contributionHSA || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                updateFormData({
                  taxAdvantageAccounts: {
                    ...(formData.taxAdvantageAccounts || {} as TaxAdvantageAccounts),
                    contributionHSA: value ? parseInt(value) : 0
                  } as TaxAdvantageAccounts
                });
              }}
              placeholder="Enter HSA contributions"
              onlyNumbers
            />
          </div>
          
          <div className="mt-3">
            <FormInput
              label="Are you 50 or older? (Eligible for catch-up contributions)"
              name="isCatchUpEligible"
              type="checkbox"
              value={formData.taxAdvantageAccounts?.isCatchUpEligible || false}
              checked={formData.taxAdvantageAccounts?.isCatchUpEligible || false}
              onChange={(e) => {
                updateFormData({
                  taxAdvantageAccounts: {
                    ...(formData.taxAdvantageAccounts || {} as TaxAdvantageAccounts),
                    isCatchUpEligible: (e.target as HTMLInputElement).checked
                  } as TaxAdvantageAccounts
                });
              }}
            />
          </div>
        </div>
        
        {/* Charitable Giving Section */}
        <div className="bg-yellow-50 p-4 rounded-md mt-6">
          <h3 className="text-md font-medium text-yellow-800 mb-3">Charitable Giving</h3>
          
          <p className="text-sm text-yellow-700 mb-4">
            Track your charitable giving for potential tax deductions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Current Year Giving"
              name="currentYearGiving"
              type="number"
              value={formData.charitableGiving?.currentYearGiving || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                updateFormData({
                  charitableGiving: {
                    ...(formData.charitableGiving || { 
                      currentYearGiving: 0,
                      plannedGiving: 0,
                      useDAF: false,
                      otherItemizedDeductions: 0
                    }),
                    currentYearGiving: value ? parseInt(value) : 0
                  }
                });
              }}
              placeholder="Enter current year giving"
              onlyNumbers
            />
            
            <FormInput
              label="Planned Additional Giving"
              name="plannedGiving"
              type="number"
              value={formData.charitableGiving?.plannedGiving || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                updateFormData({
                  charitableGiving: {
                    ...(formData.charitableGiving || { 
                      currentYearGiving: 0,
                      plannedGiving: 0,
                      useDAF: false,
                      otherItemizedDeductions: 0
                    }),
                    plannedGiving: value ? parseInt(value) : 0
                  }
                });
              }}
              placeholder="Enter planned giving"
              onlyNumbers
            />
          </div>
          
          <div className="mt-3">
            <FormInput
              label="Using a Donor-Advised Fund (DAF)?"
              name="useDAF"
              type="checkbox"
              value={formData.charitableGiving?.useDAF || false}
              checked={formData.charitableGiving?.useDAF || false}
              onChange={(e) => {
                updateFormData({
                  charitableGiving: {
                    ...(formData.charitableGiving || { 
                      currentYearGiving: 0,
                      plannedGiving: 0,
                      useDAF: false,
                      otherItemizedDeductions: 0
                    }),
                    useDAF: (e.target as HTMLInputElement).checked
                  }
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxPlanningStep;
