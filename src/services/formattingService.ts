/**
 * Formatting utility functions for currency and percentage values
 */

/**
 * Format a number as currency (USD)
 * 
 * @param amount - The amount to format
 * @param fractionDigits - Number of fraction digits to display (default: 2)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, fractionDigits: number = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(amount);
};

/**
 * Format a number as percentage
 * 
 * @param rate - The rate to format (e.g., 0.25 for 25%)
 * @param fractionDigits - Number of fraction digits to display (default: 1)
 * @returns Formatted percentage string
 */
export const formatPercent = (rate: number, fractionDigits: number = 1): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(rate);
};

/**
 * Get a CSS color class based on tax rate
 * 
 * @param rate - The tax rate (e.g., 0.25 for 25%)
 * @returns CSS class name for the appropriate color
 */
export const getTaxRateColorClass = (rate: number): string => {
  if (rate < 0.15) return 'text-green-600';
  if (rate < 0.25) return 'text-yellow-600';
  if (rate < 0.35) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get an emoji icon for different income types
 * 
 * @param type - The income type
 * @returns Emoji representing the income type
 */
export const getIncomeTypeIcon = (type: string): string => {
  switch (type) {
    case 'bonus':
      return '💰';
    case 'rsu':
      return '📈';
    case 'capitalGains':
      return '💹';
    case 'k1':
      return '📊';
    default:
      return '💵';
  }
};
