import React from 'react';
import type { SpecialIncomeItem as SpecialIncomeItemType } from '../../types';
import FormInput from '../FormInput';

interface SpecialIncomeItemProps {
  item: SpecialIncomeItemType;
  index: number;
  handleSpecialIncomeChange: (index: number, field: keyof SpecialIncomeItemType, value: string | number | boolean) => void;
  removeSpecialIncomeItem: (index: number) => void;
}

const SpecialIncomeItem: React.FC<SpecialIncomeItemProps> = ({
  item,
  index,
  handleSpecialIncomeChange,
  removeSpecialIncomeItem
}) => {
  return (
    <div key={index} className="bg-gray-50 p-4 rounded-md relative">
      <button
        type="button"
        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
        onClick={() => removeSpecialIncomeItem(index)}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          label="Type"
          name={`specialIncomeItems[${index}].type`}
          type="select"
          value={item.type}
          onChange={(e) => handleSpecialIncomeChange(index, 'type', e.target.value)}
          options={[
            { value: 'bonus', label: 'Bonus' },
            { value: 'rsu', label: 'RSU / Stock' },
            { value: 'capitalGains', label: 'Capital Gains' },
            { value: 'k1', label: 'K-1 / Partnership' },
            { value: 'iso', label: 'Incentive Stock Options (ISO)' },
            { value: 'nso', label: 'Non-Qualified Stock Options (NSO)' },
            { value: 'other', label: 'Other' }
          ]}
        />
        
        <FormInput
          label="Amount"
          name={`specialIncomeItems[${index}].amount`}
          type="number"
          value={item.amount || 0}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, '');
            handleSpecialIncomeChange(index, 'amount', value ? parseFloat(value) : 0);
          }}
          placeholder="Enter amount"
          step="0.01"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <FormInput
          label="Withholding"
          name={`specialIncomeItems[${index}].withholding`}
          type="number"
          value={item.withholding || 0}
          onChange={(e) => {
            const value = e.target.value.replace(/[^0-9.]/g, '');
            handleSpecialIncomeChange(index, 'withholding', value ? parseFloat(value) : 0);
          }}
          placeholder="Enter withholding"
          step="0.01"
          helpText="Tax already withheld"
        />
        
        <FormInput
          label="Date"
          name={`specialIncomeItems[${index}].date`}
          type="text"
          value={item.date || new Date().toISOString().split('T')[0]}
          onChange={(e) => handleSpecialIncomeChange(index, 'date', e.target.value)}
          helpText="Format: YYYY-MM-DD"
        />
      </div>
      
      {(item.type === 'capitalGains' || item.type === 'rsu') && (
        <div className="mt-2">
          <FormInput
            label="Holding Period"
            name={`specialIncomeItems[${index}].holdingPeriod`}
            type="select"
            value={item.holdingPeriod || 'shortTerm'}
            onChange={(e) => handleSpecialIncomeChange(index, 'holdingPeriod', e.target.value)}
            options={[
              { value: 'shortTerm', label: 'Short Term (≤ 1 year)' },
              { value: 'longTerm', label: 'Long Term (> 1 year)' }
            ]}
            helpText="Holding period affects tax rate"
          />
        </div>
      )}
      
      {(item.type === 'iso' || item.type === 'nso') && (
        <div className="mt-4 border-t pt-4 border-gray-200">
          <h4 className="text-sm font-medium mb-3">Stock Option Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Exercise Price"
              name={`specialIncomeItems[${index}].exercisePrice`}
              type="number"
              value={item.exercisePrice || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleSpecialIncomeChange(index, 'exercisePrice', value ? parseFloat(value) : 0);
              }}
              placeholder="Price per share"
              helpText="Price to purchase each share"
              step="0.25"
            />
            
            <FormInput
              label="Fair Market Value"
              name={`specialIncomeItems[${index}].fairMarketValue`}
              type="number"
              value={item.fairMarketValue || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, '');
                handleSpecialIncomeChange(index, 'fairMarketValue', value ? parseFloat(value) : 0);
              }}
              placeholder="Current value per share"
              helpText="Current market value per share"
              step="0.25"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <FormInput
              label="Number of Shares"
              name={`specialIncomeItems[${index}].numberOfShares`}
              type="number"
              value={item.numberOfShares || 0}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                handleSpecialIncomeChange(index, 'numberOfShares', value ? parseInt(value) : 0);
              }}
              placeholder="Number of shares"
              onlyNumbers
            />
            
            <FormInput
              label="83(b) Election"
              name={`specialIncomeItems[${index}].is83bElection`}
              type="select"
              value={item.is83bElection ? 'yes' : 'no'}
              onChange={(e) => handleSpecialIncomeChange(index, 'is83bElection', e.target.value === 'yes')}
              options={[
                { value: 'no', label: 'No' },
                { value: 'yes', label: 'Yes' }
              ]}
              helpText="Filed 83(b) election?"
            />
          </div>
          
          {item.is83bElection && (
            <div className="mt-2">
              <FormInput
                label="Election Filing Date"
                name={`specialIncomeItems[${index}].electionFilingDate`}
                type="text"
                value={item.electionFilingDate || ''}
                onChange={(e) => handleSpecialIncomeChange(index, 'electionFilingDate', e.target.value)}
                placeholder="YYYY-MM-DD"
                helpText="Date 83(b) election was filed"
              />
            </div>
          )}
          
          {item.type === 'iso' && (
            <div className="mt-2">
              <FormInput
                label="Disqualifying Disposition"
                name={`specialIncomeItems[${index}].disqualifyingDisposition`}
                type="select"
                value={item.disqualifyingDisposition ? 'yes' : 'no'}
                onChange={(e) => handleSpecialIncomeChange(index, 'disqualifyingDisposition', e.target.value === 'yes')}
                options={[
                  { value: 'no', label: 'No' },
                  { value: 'yes', label: 'Yes' }
                ]}
                helpText="Sold before qualifying disposition period?"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpecialIncomeItem;
