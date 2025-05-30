import { useState } from 'react';
import type { DualEarnerAnalysis, W4Recommendation } from '../types';
import { analyzeDualEarnerHousehold, createW4Recommendations } from '../services/dualEarnerService';

interface DualEarnerCalculatorProps {
  primaryIncome: number;
  primaryWithholding: number;
  filingStatus: string;
  onSecondEarnerUpdate?: (
    secondaryIncome: number, 
    secondaryWithholding: number, 
    analysis: DualEarnerAnalysis
  ) => void;
}

const DualEarnerCalculator = ({ 
  primaryIncome,
  primaryWithholding,
  filingStatus,
  onSecondEarnerUpdate 
}: DualEarnerCalculatorProps) => {
  const [secondaryIncome, setSecondaryIncome] = useState<number>(0);
  const [secondaryWithholding, setSecondaryWithholding] = useState<number>(0);
  const [payFrequency, setPayFrequency] = useState<'annual' | 'monthly' | 'biweekly' | 'weekly'>('annual');
  const [dualEarnerAnalysis, setDualEarnerAnalysis] = useState<DualEarnerAnalysis | null>(null);
  const [w4Recommendation, setW4Recommendation] = useState<W4Recommendation | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  
  // Calculate annual values based on pay frequency
  const getAnnualValue = (value: number): number => {
    switch (payFrequency) {
      case 'monthly': return value * 12;
      case 'biweekly': return value * 26;
      case 'weekly': return value * 52;
      default: return value; // annual
    }
  };
  
  const handleSecondaryIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSecondaryIncome(value ? parseInt(value) : 0);
  };
  
  const handleSecondaryWithholdingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setSecondaryWithholding(value ? parseInt(value) : 0);
  };
  
  const handlePayFrequencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPayFrequency(e.target.value as 'annual' | 'monthly' | 'biweekly' | 'weekly');
  };
  
  const handleAnalyze = () => {
    if (secondaryIncome > 0) {
      const annualSecondaryIncome = getAnnualValue(secondaryIncome);
      const annualSecondaryWithholding = getAnnualValue(secondaryWithholding);
      
      const analysis = analyzeDualEarnerHousehold(
        primaryIncome,
        primaryWithholding,
        annualSecondaryIncome,
        annualSecondaryWithholding,
        filingStatus
      );
      
      setDualEarnerAnalysis(analysis);
      setW4Recommendation(createW4Recommendations(analysis));
      setShowResults(true);
      
      if (onSecondEarnerUpdate) {
        onSecondEarnerUpdate(annualSecondaryIncome, annualSecondaryWithholding, analysis);
      }
    }
  };
  
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatPercentage = (rate: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(rate);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Dual Earner Household Calculator</h2>
      <p className="text-sm text-gray-600 mb-4">
        When both spouses work, withholding tables may not account for your combined income bracket.
        Add your spouse's income to analyze the impact and get W-4 recommendations.
      </p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Second Earner's Income
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={secondaryIncome === 0 ? '' : secondaryIncome}
              onChange={handleSecondaryIncomeChange}
              placeholder="Enter income amount"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Second Earner's Current Tax Withholding
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={secondaryWithholding === 0 ? '' : secondaryWithholding}
              onChange={handleSecondaryWithholdingChange}
              placeholder="Enter withholding amount"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pay Frequency
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={payFrequency}
            onChange={handlePayFrequencyChange}
          >
            <option value="annual">Annual</option>
            <option value="monthly">Monthly</option>
            <option value="biweekly">Bi-weekly (Every Two Weeks)</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
        
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleAnalyze}
        >
          Analyze Dual Income
        </button>
      </div>
      
      {showResults && dualEarnerAnalysis && w4Recommendation && (
        <div className="mt-6 space-y-6">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-900 mb-3">Dual Earner Analysis</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Income:</span>
                <span className="font-medium">{formatCurrency(dualEarnerAnalysis.primaryIncome)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Secondary Income:</span>
                <span className="font-medium">{formatCurrency(dualEarnerAnalysis.secondaryIncome)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Combined Income:</span>
                <span className="font-medium">{formatCurrency(dualEarnerAnalysis.combinedIncome)}</span>
              </div>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Primary Withholding:</span>
                <span className="font-medium">{formatCurrency(dualEarnerAnalysis.primaryWithholding)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Secondary Withholding:</span>
                <span className="font-medium">{formatCurrency(dualEarnerAnalysis.secondaryWithholding)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Combined Withholding:</span>
                <span className="font-medium">{formatCurrency(dualEarnerAnalysis.combinedWithholding)}</span>
              </div>
              
              <div className="border-t border-gray-200 my-2"></div>
              
              <div className="flex justify-between font-medium">
                <span className="text-gray-900">Withholding Gap:</span>
                <span className={dualEarnerAnalysis.withholdingGap > 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatCurrency(dualEarnerAnalysis.withholdingGap)}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Effective Gap Rate:</span>
                <span className="font-medium">
                  {formatPercentage(dualEarnerAnalysis.withholdingGap / dualEarnerAnalysis.combinedIncome)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">W-4 Recommendations</h3>
            
            {dualEarnerAnalysis.withholdingGap > 0 ? (
              <div>
                <p className="text-sm text-gray-700 mb-3">
                  Based on your dual income situation, we recommend the following W-4 adjustments:
                </p>
                
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  {w4Recommendation.recommendedChanges.map((recommendation, index) => (
                    <li key={index}>{recommendation}</li>
                  ))}
                </ul>
                
                {w4Recommendation.additionalWithholding > 0 && (
                  <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                    <span className="font-medium text-yellow-800">Recommended Monthly Additional Withholding: </span>
                    <span className="font-bold">{formatCurrency(w4Recommendation.additionalWithholding)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-700">
                Good news! Your current withholding appears to be sufficient for your dual income situation.
                No additional withholding is needed at this time.
              </p>
            )}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Why This Matters</h3>
            <p className="text-sm text-gray-600 mb-2">
              When both spouses work, each employer withholds taxes as if their paycheck is the only income in the household.
              This can lead to underwithholding when your combined income pushes you into a higher tax bracket.
            </p>
            <p className="text-sm text-gray-600">
              The IRS W-4 form has specific options for dual-income households. Adjusting your W-4 now can help you avoid
              a surprise tax bill when you file next year.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DualEarnerCalculator;
