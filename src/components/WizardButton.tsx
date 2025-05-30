import React from 'react';
import type { ButtonHTMLAttributes } from 'react';

interface WizardButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

/**
 * Reusable styled button component for the wizard
 */
const WizardButton: React.FC<WizardButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  // Base styles
  const baseStyles = 'font-medium transition-all duration-200 rounded-md px-4 py-2';
  
  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50'
  };
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${className}`;
  
  return (
    <button 
      type="button"
      className={buttonStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default WizardButton;
