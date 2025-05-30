import React from 'react';
import { useWizardState } from '../hooks/useWizardState';
import { useFormData } from '../hooks/useFormData';
import BasicInfoStep from '../components2/BasicInfoStep';
import IncomeSourcesStep from '../components2/IncomeSourcesStep';
import TaxPlanningStep from '../components2/TaxPlanningStep';
import ResultsStep from '../components2/ResultsStep';

/**
 * Component responsible for rendering the appropriate step based on current wizard state
 */
const WizardStepRenderer: React.FC = () => {
  const { currentStep, calculationResult } = useWizardState();
  const { formData, updateFormData, errors } = useFormData();

  // Render current step based on wizard state
  switch (currentStep) {
    case 1:
      return (
        <BasicInfoStep 
          formData={formData} 
          updateFormData={updateFormData}
          errors={errors}
        />
      );
    case 2:
      return (
        <IncomeSourcesStep 
          formData={formData} 
          updateFormData={updateFormData}
          errors={errors}
        />
      );
    case 3:
      return (
        <TaxPlanningStep 
          formData={formData} 
          updateFormData={updateFormData}
          errors={errors}
        />
      );
    case 4:
      return (
        <ResultsStep 
          formData={formData}
          calculationResult={calculationResult}
          onReset={() => {}} // This will be handled by WizardNavigation
        />
      );
    default:
      return null;
  }
};

export default WizardStepRenderer;
