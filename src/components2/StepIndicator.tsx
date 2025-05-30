import React from 'react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ 
  steps, 
  currentStep,
  onStepClick
}) => {
  return (
    <div className="step-indicator">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        // Make all steps clickable
        const isClickable = onStepClick !== undefined;
        
        return (
          <React.Fragment key={stepNumber}>
            {/* Step circle */}
            <div 
              className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isActive && !isCompleted ? 'inactive' : ''}`}
              style={{
                cursor: isClickable ? 'pointer' : 'default',
                backgroundColor: isActive ? 'var(--primary-600)' : isCompleted ? 'var(--secondary-500)' : 'var(--neutral-200)',
                color: isActive || isCompleted ? 'white' : 'var(--neutral-600)'
              }}
              onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
            >
              {isCompleted ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            
            {/* Step label */}
            <div 
              className={`step-label ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${!isActive && !isCompleted ? 'inactive' : ''}`}
              style={{
                cursor: isClickable ? 'pointer' : 'default',
                color: isActive ? 'var(--primary-600)' : isCompleted ? 'var(--secondary-500)' : 'var(--neutral-600)'
              }}
              onClick={() => isClickable && onStepClick && onStepClick(stepNumber)}
            >
              {step}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="step-connector" 
                style={{
                  backgroundColor: stepNumber < currentStep ? 'var(--primary-500)' : 'var(--neutral-200)'
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
