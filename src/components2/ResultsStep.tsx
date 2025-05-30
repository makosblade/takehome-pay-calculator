import React from 'react';
import type { EnhancedCalculationInput, CalculationResult } from '../types';

// Import sub-components
import IncomeBreakdownCard from './results/IncomeBreakdownCard';
import TaxSummaryCard from './results/TaxSummaryCard';
import DualEarnerAnalysis from './results/DualEarnerAnalysis';
import MarriedSeparateAnalysis from './results/MarriedSeparateAnalysis';
import SafeHarborStatus from './results/SafeHarborStatus';
import TaxPlanningRecommendations from './results/TaxPlanningRecommendations';
import ResultsActions from './results/ResultsActions';

interface ResultsStepProps {
  formData: EnhancedCalculationInput;
  calculationResult: CalculationResult | null;
  onReset: () => void;
}

const ResultsStep: React.FC<ResultsStepProps> = ({
  formData,
  calculationResult,
  onReset
}) => {

  if (!calculationResult) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-sm text-gray-600 mt-1">
          Calculating your take-home pay...
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Take-Home Pay Results</h2>
        <p className="text-sm text-gray-600 mt-1">
          Here's a breakdown of your income and taxes based on the information you provided.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncomeBreakdownCard 
          formData={formData} 
          calculationResult={calculationResult} 
        />
        <TaxSummaryCard 
          formData={formData} 
          calculationResult={calculationResult} 
        />
      </div>
      
      {formData.filingStatus === 'married' && formData.isSecondEarner && (
        <DualEarnerAnalysis 
          formData={formData} 
          calculationResult={calculationResult} 
        />
      )}
      
      {formData.filingStatus === 'marriedSeparate' && (
        <MarriedSeparateAnalysis 
          formData={formData} 
        />
      )}
      
      {formData.priorYearTax && formData.priorYearTax > 0 && (
        <SafeHarborStatus 
          formData={formData} 
          calculationResult={calculationResult} 
        />
      )}
      
      <TaxPlanningRecommendations 
        formData={formData} 
        calculationResult={calculationResult} 
      />
      
      <ResultsActions onReset={onReset} />
    </div>
  );
};

export default ResultsStep;
