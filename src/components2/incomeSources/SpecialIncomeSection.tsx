import React from 'react';
import type { EnhancedCalculationInput, SpecialIncomeItem as SpecialIncomeItemType } from '../../types';
import SpecialIncomeItem from './SpecialIncomeItem';
import Button from '../../components/Button';
import InfoBox from '../../components/InfoBox';

interface SpecialIncomeSectionProps {
  formData: EnhancedCalculationInput;
  showSpecialIncome: boolean;
  setShowSpecialIncome: (show: boolean) => void;
  handleSpecialIncomeChange: (index: number, field: keyof SpecialIncomeItemType, value: string | number | boolean) => void;
  removeSpecialIncomeItem: (index: number) => void;
  addSpecialIncomeItem: () => void;
  onShowStockOptionCalculator?: () => void;
}

const SpecialIncomeSection: React.FC<SpecialIncomeSectionProps> = ({
  formData,
  showSpecialIncome,
  setShowSpecialIncome,
  handleSpecialIncomeChange,
  removeSpecialIncomeItem,
  addSpecialIncomeItem,
  onShowStockOptionCalculator
}) => {
  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-gray-800">Special Income Items</h3>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={() => setShowSpecialIncome(!showSpecialIncome)}
        >
          {showSpecialIncome ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {showSpecialIncome && (
        <div className="mt-2 space-y-4">
          {(formData.specialIncomeItems || []).map((item, index) => (
            <SpecialIncomeItem
              key={index}
              item={item}
              index={index}
              handleSpecialIncomeChange={handleSpecialIncomeChange}
              removeSpecialIncomeItem={removeSpecialIncomeItem}
            />
          ))}
          
          <div className="flex flex-col md:flex-row gap-2 mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={addSpecialIncomeItem}
            >
              + Add Special Income
            </Button>
            
            {onShowStockOptionCalculator && (
              <Button
                type="button"
                variant="primary"
                onClick={onShowStockOptionCalculator}
              >
                Use Stock Option Calculator
              </Button>
            )}
          </div>
          
          {(formData.specialIncomeItems || []).some(item => item.type === 'iso' || item.type === 'nso') && (
            <div className="mt-4">
              <InfoBox title="Stock Options" variant="info">
                <p className="text-sm">
                  For more detailed tax calculations for stock options, including AMT implications and 83(b) election guidance,
                  use the dedicated Stock Option Calculator.
                </p>
              </InfoBox>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialIncomeSection;
