import type { CalculationInput } from '../types';

interface ValidationErrors {
  grossIncome?: string;
  state?: string;
  city?: string;
  payPeriod?: string;
  filingStatus?: string;
  [key: string]: string | undefined;
}

/**
 * Validates tax calculator form inputs
 * 
 * @param formData - The form data to validate
 * @returns Object containing validation errors, if any
 */
export const validateTaxCalculatorForm = (formData: Partial<CalculationInput>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.grossIncome || formData.grossIncome <= 0) {
    errors.grossIncome = 'Gross income must be greater than 0';
  }

  if (!formData.state) {
    errors.state = 'State is required';
  }

  if (!formData.payPeriod) {
    errors.payPeriod = 'Pay period is required';
  }

  if (!formData.filingStatus) {
    errors.filingStatus = 'Filing status is required';
  }

  return errors;
};

/**
 * Validates special income item inputs
 * 
 * @param amount - The income amount
 * @param withholding - The withholding amount
 * @returns Error message if validation fails, or undefined if valid
 */
export const validateSpecialIncomeItem = (
  amount: number,
  withholding: number
): string | undefined => {
  if (!amount || amount <= 0) {
    return 'Amount must be greater than 0';
  }

  if (withholding < 0) {
    return 'Withholding cannot be negative';
  }

  if (withholding > amount) {
    return 'Withholding cannot exceed the income amount';
  }

  return undefined;
};

/**
 * Validates safe harbor calculator inputs
 * 
 * @param priorYearTax - Prior year tax amount
 * @returns Error message if validation fails, or undefined if valid
 */
export const validateSafeHarborInputs = (
  priorYearTax: number
): string | undefined => {
  if (!priorYearTax || priorYearTax <= 0) {
    return 'Prior year tax must be greater than 0';
  }

  return undefined;
};
