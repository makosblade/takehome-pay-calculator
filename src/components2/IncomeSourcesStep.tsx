import React, { useState } from 'react';
import type { EnhancedCalculationInput, SpecialIncomeItem } from '../types';
import PrimaryIncomeSection from './incomeSources/PrimaryIncomeSection';
import SecondaryIncomeSection from './incomeSources/SecondaryIncomeSection';
import SpecialIncomeSection from './incomeSources/SpecialIncomeSection';
import IncomeSummary from './incomeSources/IncomeSummary';
import StockOptionCalculator from './stockCalculators/StockOptionCalculator';

interface IncomeSourcesStepProps {
  formData: EnhancedCalculationInput;
  updateFormData: (data: Partial<EnhancedCalculationInput>, errors?: {[key: string]: string}) => void;
  errors: {[key: string]: string};
}

const IncomeSourcesStep: React.FC<IncomeSourcesStepProps> = ({
  formData,
  updateFormData,
  errors
}) => {
  const [showSpecialIncome, setShowSpecialIncome] = useState(false);
  const [showStockOptionCalculator, setShowStockOptionCalculator] = useState(false);
  
  // Handle numeric input changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const { name, value } = e.target;
      const numericValue = value.replace(/[^0-9.]/g, '');
      
      updateFormData({
        [name]: numericValue ? parseFloat(numericValue) : 0
      });
    }
  };
  
  // Handle pay period changes
  const handlePayPeriodChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLSelectElement) {
      const { name, value } = e.target;
      
      if (name === 'secondEarnerPayPeriod') {
        updateFormData({
          secondEarnerPayPeriod: value as EnhancedCalculationInput['payPeriod']
        });
      } else {
        updateFormData({
          payPeriod: value as EnhancedCalculationInput['payPeriod']
        });
      }
    }
  };
  
  // Handle special income item changes
  const handleSpecialIncomeChange = (index: number, field: keyof SpecialIncomeItem, value: string | number | boolean) => {
    const updatedItems = [...(formData.specialIncomeItems || [])];
    
    if (!updatedItems[index]) {
      updatedItems[index] = {
        type: 'other',
        amount: 0,
        withholding: 0,
        date: new Date().toISOString().split('T')[0]
      };
    }
    
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'amount' || field === 'withholding' 
        ? (typeof value === 'string' ? (value ? parseInt(value) : 0) : value) 
        : value
    } as SpecialIncomeItem;
    
    updateFormData({
      specialIncomeItems: updatedItems
    });
  };
  
  // Add new special income item
  const addSpecialIncomeItem = () => {
    const updatedItems = [...(formData.specialIncomeItems || []), {
      type: 'other' as const,
      amount: 0,
      withholding: 0,
      date: new Date().toISOString().split('T')[0]
    }];
    
    updateFormData({
      specialIncomeItems: updatedItems
    });
  };
  
  // Remove special income item
  const removeSpecialIncomeItem = (index: number) => {
    const updatedItems = [...(formData.specialIncomeItems || [])];
    updatedItems.splice(index, 1);
    
    updateFormData({
      specialIncomeItems: updatedItems
    });
  };
  
  // Currency formatting is now handled in the IncomeSummary component
  
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
  
  // Calculate annual income for display
  const primaryAnnualIncome = calculateAnnualIncome(formData.grossIncome, formData.payPeriod);
  const secondaryAnnualIncome = formData.isSecondEarner 
    ? calculateAnnualIncome(formData.secondEarnerIncome || 0, formData.payPeriod) 
    : 0;
  const totalAnnualIncome = primaryAnnualIncome + secondaryAnnualIncome;
  
  // Calculate special income total
  const specialIncomeTotal = (formData.specialIncomeItems || []).reduce(
    (total, item) => total + (item.amount || 0), 
    0
  );
  
  // Grand total income
  const grandTotalIncome = totalAnnualIncome + specialIncomeTotal;
  
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Income Sources</h2>
        <p className="text-sm text-gray-600 mt-1">
          {formData.filingStatus === 'married' 
            ? "Enter income information for both you and your spouse." 
            : "Enter your income information."}
        </p>
      </div>
      
      {/* Primary Income Section */}
      <PrimaryIncomeSection 
        formData={formData}
        handleNumericChange={handleNumericChange}
        handlePayPeriodChange={handlePayPeriodChange}
        errors={errors}
      />
      
      {/* Secondary Income Section - Only for Married Filing Jointly with Second Earner */}
      <SecondaryIncomeSection
        formData={formData}
        handleNumericChange={handleNumericChange}
        handlePayPeriodChange={handlePayPeriodChange}
        errors={errors}
      />
      
      {/* Special Income Section */}
      <SpecialIncomeSection
        formData={formData}
        showSpecialIncome={showSpecialIncome}
        setShowSpecialIncome={setShowSpecialIncome}
        handleSpecialIncomeChange={handleSpecialIncomeChange}
        removeSpecialIncomeItem={removeSpecialIncomeItem}
        addSpecialIncomeItem={addSpecialIncomeItem}
        onShowStockOptionCalculator={() => setShowStockOptionCalculator(true)}
      />
      
      {/* Stock Option Calculator */}
      {showStockOptionCalculator && (
        <div className="mt-6 border p-4 rounded-lg bg-white shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Stock Option Calculator</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowStockOptionCalculator(false)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <StockOptionCalculator
            baseIncome={formData.grossIncome}
            filingStatus={formData.filingStatus}
            onStockOptionAdded={(stockOption: SpecialIncomeItem) => {
              // Add the stock option to special income items
              const updatedItems = [...(formData.specialIncomeItems || []), stockOption];
              
              // Update the form data with just the special income items
              updateFormData({
                specialIncomeItems: updatedItems
              });
              
              // Close the calculator
              setShowStockOptionCalculator(false);
            }}
          />
        </div>
      )}
      
      {/* Income Summary */}
      <IncomeSummary
        formData={formData}
        primaryAnnualIncome={primaryAnnualIncome}
        secondaryAnnualIncome={secondaryAnnualIncome}
        specialIncomeTotal={specialIncomeTotal}
        grandTotalIncome={grandTotalIncome}
      />
    </div>
  );
};

export default IncomeSourcesStep;
