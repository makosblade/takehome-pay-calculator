import { useContext } from 'react';
import { WizardStateContext, type WizardStateContextType } from '../contexts/WizardStateContext';

/**
 * Custom hook to use the wizard state context
 */
export const useWizardState = (): WizardStateContextType => {
  const context = useContext(WizardStateContext);
  if (context === undefined) {
    throw new Error('useWizardState must be used within a WizardStateProvider');
  }
  return context;
};
