import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CalculationResult, EnhancedCalculationInput } from '../types';
import { useFormData } from '../hooks/useFormData';
import { calculateTakeHomePay } from '../services/taxCalculationService';

// Define the context type
export interface WizardStateContextType {
  currentStep: number;
  calculationComplete: boolean;
  calculationResult: CalculationResult | null;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  goToStep: (step: number) => void;
  calculateResults: () => void;
  resetWizard: () => void;
  isStepValid: (step: number) => boolean;
  totalSteps: number;
}

// Create the context with a default value
export const WizardStateContext = createContext<WizardStateContextType | undefined>(undefined);

// Provider component
interface WizardStateProviderProps {
  children: ReactNode;
  onCalculate?: (values: EnhancedCalculationInput) => void;
  totalSteps?: number;
}

export const WizardStateProvider: React.FC<WizardStateProviderProps> = ({ 
  children, 
  onCalculate,
  totalSteps = 4
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [calculationComplete, setCalculationComplete] = useState(false);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  
  const { formData, validateStep, validateAllSteps, resetFormData } = useFormData();

  // Check if a step is valid
  const isStepValid = (step: number): boolean => {
    const errors = validateStep(step);
    return Object.keys(errors).length === 0;
  };

  // Handle next step navigation
  const goToNextStep = () => {
    if (isStepValid(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        // Last step, calculate results
        calculateResults();
      }
    }
  };

  // Handle previous step navigation
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Go to a specific step
  const goToStep = (step: number) => {
    // Allow navigation to any step if all steps up to that point are valid
    // or if we're going to a previous step
    const allPreviousStepsValid = Array.from({ length: step }, (_, i) => i + 1)
      .every(stepNum => stepNum === step || isStepValid(stepNum));
    
    if (step < currentStep || allPreviousStepsValid) {
      setCurrentStep(step);
    }
  };

  // Calculate results
  const calculateResults = () => {
    const allErrors = validateAllSteps();
    
    if (Object.keys(allErrors).length === 0) {
      if (onCalculate) {
        onCalculate(formData);
      }
      
      setCalculationComplete(true);
      
      // Use the tax calculation service for accurate results
      const calculationInput = {
        grossIncome: formData.grossIncome,
        payPeriod: formData.payPeriod,
        state: formData.state,
        city: formData.city,
        district: formData.district,
        filingStatus: formData.filingStatus
      };
      
      // Calculate take-home pay using the service
      const result = calculateTakeHomePay(calculationInput);
      
      // Set the calculation result
      setCalculationResult(result);
    } else {
      // Go to the first step with errors
      for (let i = 1; i <= totalSteps - 1; i++) {
        if (Object.keys(validateStep(i)).length > 0) {
          setCurrentStep(i);
          break;
        }
      }
    }
  };

  // Reset wizard
  const resetWizard = () => {
    resetFormData();
    setCurrentStep(1);
    setCalculationComplete(false);
    setCalculationResult(null);
  };

  // Create the context value
  const contextValue: WizardStateContextType = {
    currentStep,
    calculationComplete,
    calculationResult,
    goToNextStep,
    goToPrevStep,
    goToStep,
    calculateResults,
    resetWizard,
    isStepValid,
    totalSteps
  };

  return (
    <WizardStateContext.Provider value={contextValue}>
      {children}
    </WizardStateContext.Provider>
  );
};

// The hook is now in a separate file: src/hooks/useWizardState.ts
