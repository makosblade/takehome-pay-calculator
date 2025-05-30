import React from 'react';
import WizardButton from './WizardButton';
import { useWizardState } from '../hooks/useWizardState';

interface WizardNavigationProps {
  className?: string;
}

/**
 * Navigation component for the wizard
 * Handles back, next, calculate, and reset buttons
 */
const WizardNavigation: React.FC<WizardNavigationProps> = ({ className = '' }) => {
  const { 
    currentStep, 
    totalSteps,
    calculationComplete, 
    goToNextStep, 
    goToPrevStep, 
    resetWizard 
  } = useWizardState();

  return (
    <div className={`flex justify-between ${className}`}>
      {/* Back button - only show if not on first step and calculation not complete */}
      {currentStep > 1 && !calculationComplete && (
        <WizardButton 
          variant="outline"
          onClick={goToPrevStep}
        >
          Back
        </WizardButton>
      )}
      
      <div className="ml-auto">
        {/* Next/Calculate button - only show if calculation not complete */}
        {!calculationComplete && (
          <WizardButton 
            variant="primary"
            onClick={goToNextStep}
          >
            {currentStep < totalSteps ? 'Next' : 'Calculate Take-Home Pay'}
          </WizardButton>
        )}
        
        {/* Reset button - only show after calculation is complete */}
        {calculationComplete && (
          <WizardButton 
            variant="secondary"
            onClick={resetWizard}
          >
            Start New Calculation
          </WizardButton>
        )}
      </div>
    </div>
  );
};

export default WizardNavigation;
