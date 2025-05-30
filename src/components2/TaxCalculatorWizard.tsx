import React, { useEffect } from 'react';
import type { EnhancedCalculationInput, CalculationResult, SafeHarborCalculation } from '../types';
import StepIndicator from './StepIndicator';
import Card from '../components/Card';
import { FormDataProvider } from '../contexts/FormDataContext';
import { useFormData } from '../hooks/useFormData';
import { WizardStateProvider } from '../contexts/WizardStateContext';
import { useWizardState } from '../hooks/useWizardState';
import WizardStepRenderer from '../components/WizardStepRenderer';
import WizardNavigation from '../components/WizardNavigation';
import { CalculationService } from '../services/CalculationService';
import PersistentSummaryPanel from './PersistentSummaryPanel';

interface TaxCalculatorWizardProps {
  onCalculate: (values: EnhancedCalculationInput) => void;
  calculationResult: CalculationResult | null;
  safeHarborData: SafeHarborCalculation | null;
}

/**
 * Main component that renders the wizard UI
 */
const TaxCalculatorWizardContent: React.FC = () => {
  const { formData, updateFormData } = useFormData();
  const { currentStep, goToStep, isStepValid } = useWizardState();

  // Automatically update remaining pay periods when pay frequency changes
  useEffect(() => {
    if (formData.payFrequency) {
      const periodsRemaining = CalculationService.calculateRemainingPayPeriods(formData.payFrequency);
      
      // Only update if the value has changed to prevent infinite loop
      if (formData.payPeriodsRemaining !== periodsRemaining) {
        updateFormData({
          payPeriodsRemaining: periodsRemaining
        });
      }
    }
  }, [formData.payFrequency, formData.payPeriodsRemaining, updateFormData]);

  return (
    <Card className="p-6 flex-1 max-w-4xl">
      <div className="mb-8">
        <StepIndicator 
          steps={['Basic Info', 'Income Sources', 'Tax Planning', 'Results']}
          currentStep={currentStep}
          onStepClick={(step: number) => {
            // Only allow clicking on previous steps or the next step if current is valid
            if (step < currentStep || (step === currentStep + 1 && isStepValid(currentStep))) {
              goToStep(step);
            }
          }}
        />
      </div>
      
      <WizardStepRenderer />
      
      <WizardNavigation className="mt-8" />
    </Card>
  );
};

/**
 * Container component that provides context providers
 */
const TaxCalculatorWizard: React.FC<TaxCalculatorWizardProps> = ({ 
  onCalculate, 
  calculationResult, 
  safeHarborData 
}) => {
  return (
    <FormDataProvider>
      <WizardStateProvider onCalculate={onCalculate} totalSteps={4}>
        <div className="flex justify-between" style={{ alignItems: 'flex-start' }}>
          <TaxCalculatorWizardContent />
          <PersistentSummaryPanel 
            calculationResult={calculationResult} 
            safeHarborData={safeHarborData} 
          />
        </div>
      </WizardStateProvider>
    </FormDataProvider>
  );
};

export default TaxCalculatorWizard;
