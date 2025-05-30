import type { EnhancedCalculationInput, CalculationResult, CalculationInput } from '../types';
import { calculateTakeHomePay } from './taxCalculationService';

/**
 * Service responsible for preparing calculation data and executing calculations
 */
export class CalculationService {
  /**
   * Prepares the input data for calculation
   */
  static prepareCalculationInput(formData: EnhancedCalculationInput): CalculationInput {
    return {
      grossIncome: formData.grossIncome,
      payPeriod: formData.payPeriod,
      state: formData.state,
      city: formData.city,
      district: formData.district,
      filingStatus: formData.filingStatus
    };
  }

  /**
   * Executes the tax calculation
   */
  static calculateTakeHomePay(formData: EnhancedCalculationInput): CalculationResult {
    const calculationInput = this.prepareCalculationInput(formData);
    return calculateTakeHomePay(calculationInput);
  }

  /**
   * Formats currency values for display
   */
  static formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }

  /**
   * Formats percentage values for display
   */
  static formatPercentage(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value);
  }

  /**
   * Calculates annual income based on pay period
   */
  static calculateAnnualIncome(income: number, payPeriod: string): number {
    switch (payPeriod) {
      case 'monthly': return income * 12;
      case 'semiMonthly': return income * 24;
      case 'biweekly': return income * 26;
      case 'weekly': return income * 52;
      default: return income; // annual
    }
  }

  /**
   * Calculates remaining pay periods based on pay frequency
   */
  static calculateRemainingPayPeriods(payFrequency: string): number {
    const now = new Date();
    const endOfYear = new Date(now.getFullYear(), 11, 31);
    const daysRemaining = Math.ceil((endOfYear.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    switch (payFrequency) {
      case 'weekly':
        return Math.ceil(daysRemaining / 7);
      case 'biweekly':
        return Math.ceil(daysRemaining / 14);
      case 'semiMonthly':
        return Math.ceil(daysRemaining / 15);
      case 'monthly':
        return Math.ceil(daysRemaining / 30);
      default:
        return 0;
    }
  }
}
