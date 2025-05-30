import React from 'react';
import type { CalculationInput, EnhancedCalculationInput } from '../types';
import { calculateRemainingPayPeriods } from './safeHarborService';

/**
 * Handles numeric input changes, ensuring only numeric values are accepted
 * 
 * @param e - The input change event
 * @param currentValue - Current form state
 * @param setFormData - Function to update form state
 * @param fieldName - Name of the field being updated
 */
export const handleNumericInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  currentValue: any,
  setFormData: (value: any) => void,
  fieldName: string
): void => {
  const value = e.target.value.replace(/[^0-9]/g, '');
  setFormData({ 
    ...currentValue, 
    [fieldName]: value ? parseInt(value) : 0 
  });
};

/**
 * Handles state selection changes, resetting dependent fields
 * 
 * @param value - The selected state
 * @param currentValue - Current form state
 * @param setFormData - Function to update form state
 */
export const handleStateChange = (
  value: string,
  currentValue: EnhancedCalculationInput,
  setFormData: (value: EnhancedCalculationInput) => void
): void => {
  setFormData({ 
    ...currentValue, 
    state: value,
    city: '',
    district: '',
    isCaliforniaResident: value === 'California'
  });
};

/**
 * Handles pay period selection changes
 * 
 * @param value - The selected pay period
 * @param currentValue - Current form state
 * @param setFormData - Function to update form state
 */
export const handlePayPeriodChange = (
  value: string,
  currentValue: EnhancedCalculationInput,
  setFormData: (value: EnhancedCalculationInput) => void
): void => {
  setFormData({ 
    ...currentValue, 
    payPeriod: value as CalculationInput['payPeriod']
  });
};

/**
 * Handles filing status selection changes
 * 
 * @param value - The selected filing status
 * @param currentValue - Current form state
 * @param setFormData - Function to update form state
 */
export const handleFilingStatusChange = (
  value: string,
  currentValue: EnhancedCalculationInput,
  setFormData: (value: EnhancedCalculationInput) => void
): void => {
  setFormData({ 
    ...currentValue, 
    filingStatus: value as CalculationInput['filingStatus']
  });
};

/**
 * Handles pay frequency selection changes, updating pay periods remaining
 * 
 * @param value - The selected pay frequency
 * @param currentValue - Current form state
 * @param setFormData - Function to update form state
 */
export const handlePayFrequencyChange = (
  value: string,
  currentValue: EnhancedCalculationInput,
  setFormData: (value: EnhancedCalculationInput) => void
): void => {
  const frequency = value as 'weekly' | 'biweekly' | 'semiMonthly' | 'monthly';
  const periodsRemaining = calculateRemainingPayPeriods(frequency);
  
  setFormData({ 
    ...currentValue, 
    payFrequency: frequency,
    payPeriodsRemaining: periodsRemaining
  });
};
