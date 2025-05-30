import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { EnhancedCalculationInput } from '../types';

// Define the context type
export interface FormDataContextType {
  formData: EnhancedCalculationInput;
  errors: { [key: string]: string };
  updateFormData: (data: Partial<EnhancedCalculationInput>, fieldErrors?: { [key: string]: string }) => void;
  validateStep: (step: number) => { [key: string]: string };
  validateAllSteps: () => { [key: string]: string };
  resetFormData: () => void;
}

// Create the context with a default value
export const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

// Initial form data state
const initialFormData: EnhancedCalculationInput = {
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
  secondEarnerWithholding: 0,
  specialIncomeItems: []
};

// Provider component
interface FormDataProviderProps {
  children: ReactNode;
}

export const FormDataProvider: React.FC<FormDataProviderProps> = ({ children }) => {
  const [formData, setFormData] = useState<EnhancedCalculationInput>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Update form data with validation
  const updateFormData = (
    data: Partial<EnhancedCalculationInput>, 
    fieldErrors?: { [key: string]: string }
  ) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
    
    if (fieldErrors) {
      setErrors(prev => ({
        ...prev,
        ...fieldErrors
      }));
    }
  };

  // Validate a specific step
  const validateStep = (step: number): { [key: string]: string } => {
    const stepErrors: { [key: string]: string } = {};
    
    switch (step) {
      case 1: // Basic Info
        if (!formData.filingStatus) stepErrors.filingStatus = 'Filing status is required';
        if (!formData.state) stepErrors.state = 'State is required';
        break;
      case 2: // Income Sources
        if (formData.grossIncome <= 0) stepErrors.grossIncome = 'Primary income is required';
        if (formData.filingStatus === 'married' && formData.isSecondEarner && 
            (formData.secondEarnerIncome === undefined || formData.secondEarnerIncome <= 0)) {
          stepErrors.secondEarnerIncome = 'Second earner income is required when enabled';
        }
        break;
      case 3: // Tax Planning
        // Optional fields, no strict validation
        break;
    }
    
    return stepErrors;
  };

  // Validate all steps
  const validateAllSteps = (): { [key: string]: string } => {
    return {
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3)
    };
  };

  // Reset form data
  const resetFormData = () => {
    setFormData(initialFormData);
    setErrors({});
  };

  // Create the context value
  const contextValue: FormDataContextType = {
    formData,
    errors,
    updateFormData,
    validateStep,
    validateAllSteps,
    resetFormData
  };

  return (
    <FormDataContext.Provider value={contextValue}>
      {children}
    </FormDataContext.Provider>
  );
};

// The hook is now in a separate file: src/hooks/useFormData.ts
