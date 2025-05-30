import React, { useState } from 'react';
import type { SpecialIncomeItem, AMTCalculation } from '../../types';
import WizardButton from '../../components/WizardButton';
import InfoBox from '../../components/InfoBox';
import ISOCalculator from './ISOCalculator';
import NSOCalculator from './NSOCalculator';
import AMTCalculator from './AMTCalculator';
import Election83bChecklist from './Election83bChecklist';

interface StockOptionCalculatorProps {
  baseIncome: number;
  filingStatus: string;
  onStockOptionAdded: (stockOption: SpecialIncomeItem, amtCalculation: AMTCalculation | null) => void;
}

/**
 * Main component for calculating tax implications of stock options (ISO and NSO)
 */
const StockOptionCalculator: React.FC<StockOptionCalculatorProps> = ({
  baseIncome,
  filingStatus,
  onStockOptionAdded
}) => {
  const [optionType, setOptionType] = useState<'iso' | 'nso'>('iso');
  const [stockOption, setStockOption] = useState<SpecialIncomeItem | null>(null);
  const [amtCalculation, setAmtCalculation] = useState<AMTCalculation | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [show83bChecklist, setShow83bChecklist] = useState(false);

  const handleOptionTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionType(e.target.value as 'iso' | 'nso');
    setStockOption(null);
    setAmtCalculation(null);
    setShowResults(false);
    setShow83bChecklist(false);
  };

  const handleISOCalculation = (option: SpecialIncomeItem, amt: AMTCalculation) => {
    setStockOption(option);
    setAmtCalculation(amt);
    setShowResults(true);
    setShow83bChecklist(option.is83bElection || false);
    onStockOptionAdded(option, amt);
  };

  const handleNSOCalculation = (option: SpecialIncomeItem, taxImplications: Record<string, number>) => {
    // Store the option details and show results
    setStockOption(option);
    setAmtCalculation(null);
    setShowResults(true);
    setShow83bChecklist(option.is83bElection || false);
    
    // Log tax implications for debugging purposes
    console.log('NSO Tax Implications:', taxImplications);
    
    // Pass the option to the parent component
    onStockOptionAdded(option, null);
  };

  const handleAddAnother = () => {
    setStockOption(null);
    setAmtCalculation(null);
    setShowResults(false);
    setShow83bChecklist(false);
  };

  return (
    <div className="space-y-6">
      <InfoBox title="Stock Option Tax Calculator" variant="info">
        <p className="text-sm">
          Calculate the tax implications of exercising stock options. Choose between Incentive Stock Options (ISOs) 
          and Non-Qualified Stock Options (NSOs) to see how they impact your tax situation.
        </p>
      </InfoBox>

      {!showResults ? (
        <>
          <div className="flex items-center space-x-4 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="optionType"
                value="iso"
                checked={optionType === 'iso'}
                onChange={handleOptionTypeChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Incentive Stock Options (ISO)</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="optionType"
                value="nso"
                checked={optionType === 'nso'}
                onChange={handleOptionTypeChange}
                className="form-radio h-4 w-4 text-blue-600"
              />
              <span className="ml-2">Non-Qualified Stock Options (NSO)</span>
            </label>
          </div>

          {optionType === 'iso' ? (
            <ISOCalculator
              baseIncome={baseIncome}
              filingStatus={filingStatus}
              onCalculate={handleISOCalculation}
            />
          ) : (
            <NSOCalculator
              baseIncome={baseIncome}
              filingStatus={filingStatus}
              onCalculate={handleNSOCalculation}
            />
          )}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">
              {optionType === 'iso' ? 'ISO Tax Calculation Results' : 'NSO Tax Calculation Results'}
            </h3>
            <WizardButton onClick={handleAddAnother} variant="secondary">
              Calculate Another Option
            </WizardButton>
          </div>

          {amtCalculation && (
            <AMTCalculator amtCalculation={amtCalculation} />
          )}

          {show83bChecklist && stockOption && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">83(b) Election Checklist</h3>
              <Election83bChecklist exerciseDate={new Date(stockOption.date)} />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StockOptionCalculator;
