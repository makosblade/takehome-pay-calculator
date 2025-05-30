import React from 'react';
import { useFormData } from '../hooks/useFormData';
import type { CalculationResult, SafeHarborCalculation } from '../types';
import { formatCurrency } from '../services/formattingService';

interface PersistentSummaryPanelProps {
  calculationResult: CalculationResult | null;
  safeHarborData: SafeHarborCalculation | null;
}

// Helper function to calculate annual income based on pay frequency
const calculateAnnualIncome = (income: number = 0, frequency?: string): number => {
  if (!frequency) return income;
  switch (frequency) {
    case 'monthly': return income * 12;
    case 'semiMonthly': return income * 24;
    case 'biweekly': return income * 26;
    case 'weekly': return income * 52;
    default: return income;
  }
};

const PersistentSummaryPanel: React.FC<PersistentSummaryPanelProps> = ({
  calculationResult,
  safeHarborData,
}) => {
  const { formData } = useFormData();

  // Calculate derived data
  const primaryAnnualIncome = calculateAnnualIncome(formData.grossIncome, formData.payPeriod);
  const secondaryAnnualIncome = formData.isSecondEarner && formData.filingStatus === 'married'
    ? calculateAnnualIncome(formData.secondEarnerIncome, formData.secondEarnerPayPeriod || formData.payPeriod)
    : 0;
  const combinedAnnualIncome = primaryAnnualIncome + secondaryAnnualIncome;

  const totalYTDWithholding = (formData.currentYearWithholding || 0) + (formData.secondEarnerWithholding || 0);
  const totalSpecialIncome = (formData.specialIncomeItems || []).reduce((sum, item) => sum + (item.amount || 0), 0);

  // Helper function to format filing status for display
  const formatFilingStatus = (status: string): string => {
    switch(status) {
      case 'single': return 'Single';
      case 'married': return 'Married Filing Jointly';
      case 'marriedSeparate': return 'Married Filing Separately';
      case 'headOfHousehold': return 'Head of Household';
      default: return status;
    }
  };

  // Helper function to format pay frequency for display
  const formatPayFrequency = (frequency: string): string => {
    switch(frequency) {
      case 'weekly': return 'Weekly';
      case 'biweekly': return 'Bi-Weekly';
      case 'semiMonthly': return 'Semi-Monthly';
      case 'monthly': return 'Monthly';
      default: return frequency;
    }
  };

  return (
    <div className="persistent-summary-panel" style={{
      width: '350px',
      padding: '24px',
      backgroundColor: 'var(--neutral-50, #f9fafb)',
      borderRadius: '8px',
      border: '1px solid var(--neutral-200, #e5e7eb)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
      position: 'sticky',
      top: '16px',
      alignSelf: 'flex-start',
    }}>
      <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--primary-700, #4338ca)' }}>Summary</h3>
      
      {/* Filing Information Section */}
      <div className="summary-section mb-8">
        <h4 className="text-base font-medium mb-3 pb-2 border-b" style={{ color: 'var(--primary-600, #4f46e5)' }}>
          Filing Information
        </h4>
        <div className="space-y-5">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-2">Filing Status</span>
            <span className="text-base font-medium">{formData.filingStatus ? formatFilingStatus(formData.filingStatus) : 'N/A'}</span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-2">Location</span>
            <span className="text-base font-medium">
              {formData.state ? formData.state + (formData.city ? `, ${formData.city}` : '') : 'N/A'}
            </span>
          </div>
          
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 mb-2">Pay Frequency</span>
            <span className="text-base font-medium">{formData.payFrequency ? formatPayFrequency(formData.payFrequency) : 'N/A'}</span>
          </div>
        </div>
      </div>
      
      {/* Income Section */}
      <div className="summary-section mb-8">
        <h4 className="text-base font-medium mb-3 pb-2 border-b" style={{ color: 'var(--primary-600, #4f46e5)' }}>
          Annual Income
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Primary</span>
            <span className="text-base font-medium">{formatCurrency(primaryAnnualIncome)}</span>
          </div>
          
          {formData.isSecondEarner && formData.filingStatus === 'married' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Secondary</span>
              <span className="text-base font-medium">{formatCurrency(secondaryAnnualIncome)}</span>
            </div>
          )}
          
          {totalSpecialIncome > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Special Income</span>
              <span className="text-base font-medium">{formatCurrency(totalSpecialIncome)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <span className="text-base font-medium text-gray-700">Total</span>
            <span className="text-lg font-semibold" style={{ color: 'var(--primary-700, #4338ca)' }}>
              {formatCurrency(combinedAnnualIncome + totalSpecialIncome)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Withholding Section */}
      <div className="summary-section mb-8">
        <h4 className="text-base font-medium mb-3 pb-2 border-b" style={{ color: 'var(--primary-600, #4f46e5)' }}>
          Year-to-Date Withholding
        </h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Primary</span>
            <span className="text-base font-medium">{formatCurrency(formData.currentYearWithholding || 0)}</span>
          </div>
          
          {formData.isSecondEarner && formData.filingStatus === 'married' && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Secondary</span>
              <span className="text-base font-medium">{formatCurrency(formData.secondEarnerWithholding || 0)}</span>
            </div>
          )}
          
          <div className="flex justify-between items-center pt-2 border-t mt-2">
            <span className="text-base font-medium text-gray-700">Total</span>
            <span className="text-lg font-semibold" style={{ color: 'var(--primary-700, #4338ca)' }}>
              {formatCurrency(totalYTDWithholding)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Calculation Results Section - Only shown if available */}
      {calculationResult && (
        <div className="summary-section mb-8">
          <h4 className="text-base font-medium mb-3 pb-2 border-b" style={{ color: 'var(--primary-600, #4f46e5)' }}>
            Tax Calculation
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Federal Tax</span>
              <span className="text-base font-medium">{formatCurrency(calculationResult.federalTax)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">State Tax</span>
              <span className="text-base font-medium">{formatCurrency(calculationResult.stateTax)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">FICA</span>
              <span className="text-base font-medium">{formatCurrency(calculationResult.ficaTax)}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Medicare</span>
              <span className="text-base font-medium">{formatCurrency(calculationResult.medicareTax)}</span>
            </div>
            
            <div className="flex justify-between items-center pt-2 border-t mt-2">
              <span className="text-base font-medium text-gray-700">Total Tax</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--primary-700, #4338ca)' }}>
                {formatCurrency(calculationResult.totalTax)}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-4 pt-2 border-t">
              <span className="text-base font-medium text-gray-700">Net Income</span>
              <span className="text-lg font-semibold" style={{ color: 'var(--accent-600, #0891b2)' }}>
                {formatCurrency(calculationResult.netIncome)}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">Effective Tax Rate</span>
              <span className="text-base font-medium">
                {(calculationResult.effectiveTaxRate * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Safe Harbor Status - Only shown if available */}
      {safeHarborData && (
        <div className="summary-section mb-8">
          <h4 className="text-base font-medium mb-3 pb-2 border-b" style={{ color: 'var(--primary-600, #4f46e5)' }}>
            Safe Harbor Status
          </h4>
          <div className="p-4 rounded-md" style={{
            backgroundColor: safeHarborData.isOnTrack ? 'var(--success-50, #ecfdf5)' : 'var(--warning-50, #fffbeb)',
            color: safeHarborData.isOnTrack ? 'var(--success-800, #065f46)' : 'var(--warning-800, #92400e)',
          }}>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {safeHarborData.isOnTrack ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </svg>
              <span className="font-medium text-base">
                {safeHarborData.isOnTrack ? 'On Track' : 'Action Needed'}
              </span>
            </div>
            <p className="mt-2 text-sm">
              {safeHarborData.isOnTrack 
                ? 'Your current withholding meets safe harbor requirements.' 
                : `You need ${formatCurrency(safeHarborData.remainingWithholdingNeeded)} more withholding to meet safe harbor.`}
            </p>
          </div>
        </div>
      )}
      
      {/* Collapsible Help Section */}
      <div className="mt-auto pt-4 border-t text-sm text-gray-500">
        <details>
          <summary className="cursor-pointer font-medium">What is this panel?</summary>
          <p className="mt-2 leading-relaxed">
            This summary panel shows your current tax information and updates as you progress through the calculator. 
            It provides a quick overview of your income, withholding, and tax calculations.
          </p>
        </details>
      </div>
    </div>
  );
};

export default PersistentSummaryPanel;
