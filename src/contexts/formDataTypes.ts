import { createContext } from 'react';
import type { EnhancedCalculationInput } from '../types';

/**
 * Define the form data context type
 */
export interface FormDataContextType {
  formData: EnhancedCalculationInput;
  errors: { [key: string]: string };
  updateFormData: (data: Partial<EnhancedCalculationInput>, fieldErrors?: { [key: string]: string }) => void;
  validateStep: (step: number) => { [key: string]: string };
  validateAllSteps: () => { [key: string]: string };
  resetFormData: () => void;
}

/**
 * Create the context with a default value
 */
export const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

/**
 * Initial form data state
 */
export const initialFormData: EnhancedCalculationInput = {
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
