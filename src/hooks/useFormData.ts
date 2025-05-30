import { useContext } from 'react';
import { FormDataContext, type FormDataContextType } from '../contexts/FormDataContext';

/**
 * Custom hook to use the form data context
 */
export const useFormData = (): FormDataContextType => {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
};
