import { useState } from 'react';
import TaxCalculationResults from './components/TaxCalculationResults';
import type { EnhancedCalculationInput, CalculationResult, SafeHarborCalculation, DualEarnerAnalysis, W4Recommendation, SpecialIncomeItem, SpecialIncomeTaxImpact, AMTCalculation } from './types';
import { calculateTakeHomePay, calculateFederalTax } from './services/taxCalculationService';
import { calculateFederalSafeHarbor, createWithholdingPlan } from './services/safeHarborService';
import { createW4Recommendations } from './services/dualEarnerService';
import WithholdingPlanUI from './components/WithholdingPlanUI';
import W4RecommendationUI from './components/W4RecommendationUI';
import SpecialIncomeCalculator from './components/SpecialIncomeCalculator';
import SpecialIncomeTaxImpactUI from './components/SpecialIncomeTaxImpactUI';
import TaxCalculatorWizard from './components2/TaxCalculatorWizard';
import StockOptionCalculator from './components2/stockCalculators/StockOptionCalculator';

// Import custom theme styles
import './styles/theme.css';

/**
 * Calculate the tax impact of special income items
 */
const calculateTotalSpecialIncomeTaxImpact = (
  baseIncome: number,
  specialIncomeItems: SpecialIncomeItem[],
  filingStatus: string
): SpecialIncomeTaxImpact => {
  // Calculate total additional income
  const totalAdditionalIncome = specialIncomeItems.reduce((sum, item) => sum + item.amount, 0);
  
  // Calculate tax without special income
  const baseTax = calculateFederalTax(baseIncome, filingStatus);
  
  // Calculate tax with special income
  const totalTax = calculateFederalTax(baseIncome + totalAdditionalIncome, filingStatus);
  
  // Calculate total additional tax
  const totalAdditionalTax = totalTax - baseTax;
  
  // Calculate total withholding
  const totalWithholding = specialIncomeItems.reduce((sum, item) => sum + (item.withholding || 0), 0);
  
  // Calculate net tax due
  const netTaxDue = totalAdditionalTax - totalWithholding;
  
  // Calculate blended effective rate
  const blendedEffectiveRate = totalAdditionalIncome > 0 ? totalAdditionalTax / totalAdditionalIncome : 0;
  
  // Create itemized impacts
  const itemizedImpacts = specialIncomeItems.map(item => {
    const itemTax = (item.amount / (totalAdditionalIncome || 1)) * totalAdditionalTax;
    return {
      itemType: item.type,
      amount: item.amount,
      additionalTax: itemTax,
      effectiveTaxRate: item.amount > 0 ? itemTax / item.amount : 0
    };
  });
  
  return {
    totalAdditionalIncome,
    totalAdditionalTax,
    totalWithholding,
    netTaxDue,
    blendedEffectiveRate,
    itemizedImpacts
  };
};

function App() {
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [payPeriod, setPayPeriod] = useState<string>('annual');
  const [safeHarborData, setSafeHarborData] = useState<SafeHarborCalculation | null>(null);
  const [showSafeHarborPlan, setShowSafeHarborPlan] = useState<boolean>(false);
  const [currentInput, setCurrentInput] = useState<EnhancedCalculationInput | null>(null);
  const [dualEarnerAnalysis, setDualEarnerAnalysis] = useState<DualEarnerAnalysis | null>(null);
  const [w4Recommendation, setW4Recommendation] = useState<W4Recommendation | null>(null);
  const [showW4Recommendation, setShowW4Recommendation] = useState<boolean>(false);
  const [specialIncomeItems, setSpecialIncomeItems] = useState<SpecialIncomeItem[]>([]);
  const [specialIncomeTaxImpact, setSpecialIncomeTaxImpact] = useState<SpecialIncomeTaxImpact | null>(null);
  const [showSpecialIncomeCalculator, setShowSpecialIncomeCalculator] = useState<boolean>(false);

  const handleCalculate = (input: EnhancedCalculationInput) => {
    // Save the current input for potential recalculations
    setCurrentInput(input);
    
    // Calculate basic take-home pay
    const result = calculateTakeHomePay(input);
    setCalculationResult(result);
    setPayPeriod(input.payPeriod);
    
    // Calculate safe harbor if prior year tax is provided
    if (input.priorYearTax && input.priorYearTax > 0) {
      const annualIncome = input.payPeriod === 'annual' 
        ? input.grossIncome 
        : input.grossIncome * (input.payPeriod === 'monthly' ? 12 : 
                            input.payPeriod === 'semiMonthly' ? 24 : 
                            input.payPeriod === 'biweekly' ? 26 : 52);
      
      const safeHarbor = calculateFederalSafeHarbor(
        annualIncome,
        input.priorYearTax,
        input.currentYearWithholding || 0,
        input.filingStatus
      );
      
      setSafeHarborData(safeHarbor);
      setShowSafeHarborPlan(!safeHarbor.isOnTrack && input.payPeriodsRemaining !== undefined && input.payPeriodsRemaining > 0);
    } else {
      setSafeHarborData(null);
      setShowSafeHarborPlan(false);
    }
    
    // Process dual earner data if available
    if (input.isSecondEarner && input.secondEarnerIncome && input.secondEarnerIncome > 0) {
      // We already have the dual earner analysis from the form
      if (input.dualEarnerAnalysis) {
        setDualEarnerAnalysis(input.dualEarnerAnalysis);
        const w4Rec = createW4Recommendations(input.dualEarnerAnalysis);
        setW4Recommendation(w4Rec);
        setShowW4Recommendation(true);
      }
    } else {
      setDualEarnerAnalysis(null);
      setW4Recommendation(null);
      setShowW4Recommendation(false);
    }
    
    // Process special income items if available
    if (input.specialIncomeItems && input.specialIncomeItems.length > 0) {
      setSpecialIncomeItems(input.specialIncomeItems);
      if (input.specialIncomeTaxImpact) {
        setSpecialIncomeTaxImpact(input.specialIncomeTaxImpact);
      }
    } else {
      // Keep existing special income items if they exist
      if (specialIncomeItems.length > 0) {
        // Create a safe copy for the updated input
        const updatedSpecialIncomeTaxImpact = specialIncomeTaxImpact || {
          totalAdditionalIncome: 0,
          totalAdditionalTax: 0,
          totalWithholding: 0,
          netTaxDue: 0,
          blendedEffectiveRate: 0,
          itemizedImpacts: []
        };
        
        // Update the form data with special income items
        const updatedInput = {
          ...input,
          specialIncomeItems: specialIncomeItems,
          specialIncomeTaxImpact: updatedSpecialIncomeTaxImpact
        };
        setCurrentInput(updatedInput);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to bottom, var(--primary-50), var(--neutral-50))' }}>
      <header className="bg-white shadow-md border-b border-primary-100" style={{ borderBottomColor: 'var(--primary-100)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-700)' }}>Take-Home Pay Calculator</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--neutral-500)' }}>Calculate your after-tax income with precision</p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          {/* New Wizard UI */}
          <div className="card mb-8" style={{ borderTop: '4px solid var(--primary-500)' }}>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--primary-100)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--primary-600)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold ml-3" style={{ color: 'var(--primary-700)' }}>Take-Home Pay Calculator</h2>
            </div>
            <p className="mb-6" style={{ color: 'var(--neutral-600)' }}>
              Our step-by-step calculator provides a personalized experience for individuals and married couples with multiple income sources.
            </p>
            
            <TaxCalculatorWizard 
              onCalculate={handleCalculate} 
              calculationResult={calculationResult}
              safeHarborData={safeHarborData}
            />
          </div>
        </div>
      </main>
      
      <footer className="py-8 mt-12" style={{ backgroundColor: 'var(--primary-800)', color: 'white' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--primary-100)' }}>Take-Home Pay Calculator</h3>
              <p className="text-sm" style={{ color: 'var(--primary-200)' }}>Accurate tax estimates for better financial planning</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm mb-2" style={{ color: 'var(--primary-200)' }}>
                This calculator provides estimates only and should not be considered tax advice.
              </p>
              <p className="text-xs" style={{ color: 'var(--primary-300)' }}>
                Consult with a tax professional for personalized guidance.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
