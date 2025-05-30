import { useState } from 'react';
import type { SpecialIncomeItem, SpecialIncomeTaxImpact } from '../types';
import { calculateTotalSpecialIncomeTaxImpact } from '../services/specialIncomeService';
import Card from './Card';
import Button from './Button';
import FormInput from './FormInput';
import SummaryCard from './SummaryCard';
import InfoBox from './InfoBox';
import DataTable from './DataTable';
import { formatCurrency, formatPercent } from '../services/formattingService';

interface SpecialIncomeCalculatorProps {
  baseIncome: number;
  filingStatus: string;
  onSpecialIncomeCalculated: (specialIncomeItems: SpecialIncomeItem[], taxImpact: SpecialIncomeTaxImpact) => void;
}

const SpecialIncomeCalculator: React.FC<SpecialIncomeCalculatorProps> = ({
  baseIncome,
  filingStatus,
  onSpecialIncomeCalculated
}) => {
  const [specialIncomeItems, setSpecialIncomeItems] = useState<SpecialIncomeItem[]>([]);
  const [newItem, setNewItem] = useState<SpecialIncomeItem>({
    type: 'bonus',
    amount: 0,
    withholding: 0,
    date: new Date().toISOString().split('T')[0],
    description: '',
    holdingPeriod: 'shortTerm'
  });
  const [taxImpact, setTaxImpact] = useState<SpecialIncomeTaxImpact | null>(null);

  const handleAddItem = () => {
    if (newItem.amount <= 0) return;
    
    // Create a copy of the current items and add the new one
    const updatedItems = [...specialIncomeItems, { ...newItem }];
    setSpecialIncomeItems(updatedItems);
    
    // Calculate tax impact
    const impact = calculateTotalSpecialIncomeTaxImpact(baseIncome, updatedItems, filingStatus);
    setTaxImpact(impact);
    
    // Notify parent component
    onSpecialIncomeCalculated(updatedItems, impact);
    
    // Reset the form for a new item
    setNewItem({
      type: 'bonus',
      amount: 0,
      withholding: 0,
      date: new Date().toISOString().split('T')[0],
      description: ''
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = specialIncomeItems.filter((_, i) => i !== index);
    setSpecialIncomeItems(updatedItems);
    
    if (updatedItems.length === 0) {
      setTaxImpact(null);
      // Create an empty tax impact object when there are no items
      const emptyImpact: SpecialIncomeTaxImpact = {
        totalAdditionalIncome: 0,
        totalAdditionalTax: 0,
        totalWithholding: 0,
        netTaxDue: 0,
        blendedEffectiveRate: 0,
        itemizedImpacts: []
      };
      onSpecialIncomeCalculated([], emptyImpact);
    } else {
      const impact = calculateTotalSpecialIncomeTaxImpact(baseIncome, updatedItems, filingStatus);
      setTaxImpact(impact);
      onSpecialIncomeCalculated(updatedItems, impact);
    }
  };

  // Using formatCurrency and formatPercent from formattingService

  return (
    <Card title="Special Income Calculator">
      
      {/* Input form for new special income item */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <FormInput
          label="Income Type"
          name="incomeType"
          type="select"
          value={newItem.type}
          onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'bonus' | 'rsu' | 'capitalGains' | 'k1' | 'other' })}
          options={[
            { value: 'bonus', label: 'Bonus' },
            { value: 'rsu', label: 'RSU' },
            { value: 'capitalGains', label: 'Capital Gains' },
            { value: 'k1', label: 'K-1 Income' }
          ]}
        />
        
        <FormInput
          label="Amount"
          name="amount"
          type="number"
          value={newItem.amount === 0 ? '' : newItem.amount}
          onChange={(e) => setNewItem({ ...newItem, amount: Number(e.target.value) })}
          placeholder="Enter amount"
        />
        
        <FormInput
          label="Withholding (if any)"
          name="withholding"
          type="number"
          value={newItem.withholding === 0 ? '' : newItem.withholding}
          onChange={(e) => setNewItem({ ...newItem, withholding: Number(e.target.value) })}
          placeholder="Enter withholding amount"
        />
        
        <FormInput
          label="Description (optional)"
          name="description"
          type="text"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          placeholder="E.g., Year-end bonus, FAANG RSUs"
        />
        
        {newItem.type === 'capitalGains' && (
          <FormInput
            label="Holding Period"
            name="holdingPeriod"
            type="select"
            value={newItem.holdingPeriod ? newItem.holdingPeriod : 'shortTerm'}
            onChange={(e) => setNewItem({ ...newItem, holdingPeriod: e.target.value as 'shortTerm' | 'longTerm' })}
            options={[
              { value: 'shortTerm', label: 'Short Term (≤ 1 year)' },
              { value: 'longTerm', label: 'Long Term (> 1 year)' }
            ]}
          />
        )}
        
        {newItem.type === 'k1' && (
          <FormInput
            label="Qualified Business Income?"
            name="isQBI"
            type="select"
            value={newItem.isQBI ? 'yes' : 'no'}
            onChange={(e) => setNewItem({ ...newItem, isQBI: e.target.value === 'yes' })}
            options={[
              { value: 'yes', label: 'Yes (Eligible for 20% deduction)' },
              { value: 'no', label: 'No' }
            ]}
          />
        )}
      </div>
      
      <Button
        variant="primary"
        onClick={handleAddItem}
      >
        Add Income Item
      </Button>
      
      {/* List of added special income items */}
      {specialIncomeItems.length > 0 && (
        <InfoBox title="Added Income Items" className="mt-6">
          <DataTable
            columns={[
              { header: 'Type', accessor: (item) => <span className="capitalize">{item.type}</span> },
              { header: 'Amount', accessor: (item) => formatCurrency(item.amount) },
              { header: 'Withholding', accessor: (item) => formatCurrency(item.withholding) },
              { header: 'Description', accessor: (item) => item.description || '-' },
              { 
                header: 'Actions', 
                accessor: (item: SpecialIncomeItem) => {
                  // We need to find the index of this item in the array
                  const index = specialIncomeItems.findIndex(i => i === item);
                  return (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Remove
                    </Button>
                  );
                }
              }
            ]}
            data={specialIncomeItems}
            keyExtractor={(_, index) => index.toString()}
          />
        </InfoBox>
      )}
      
      {/* Tax impact visualization */}
      {taxImpact && (
        <InfoBox title="Tax Impact Summary" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <SummaryCard
              label="Total Additional Income"
              value={formatCurrency(taxImpact.totalAdditionalIncome)}
            />
            
            <SummaryCard
              label="Total Additional Tax"
              value={formatCurrency(taxImpact.totalAdditionalTax)}
            />
            
            <SummaryCard
              label="Blended Effective Rate"
              value={formatPercent(taxImpact.blendedEffectiveRate)}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SummaryCard
              label="Total Withholding"
              value={formatCurrency(taxImpact.totalWithholding)}
            />
            
            <SummaryCard
              variant={taxImpact.netTaxDue > 0 ? 'danger' : 'success'}
              label={taxImpact.netTaxDue > 0 ? 'Additional Tax Due' : 'Tax Overpaid'}
              value={formatCurrency(Math.abs(taxImpact.netTaxDue))}
            />
          </div>
          
          {/* Itemized tax impact visualization */}
          {taxImpact.itemizedImpacts.length > 1 && (
            <InfoBox title="Tax Impact by Income Type" className="mt-6">
              <DataTable
                columns={[
                  { header: 'Income Type', accessor: (impact) => <span className="capitalize">{impact.itemType}</span> },
                  { header: 'Amount', accessor: (impact) => formatCurrency(impact.amount) },
                  { header: 'Additional Tax', accessor: (impact) => formatCurrency(impact.additionalTax) },
                  { header: 'Effective Tax Rate', accessor: (impact) => formatPercent(impact.effectiveTaxRate) }
                ]}
                data={taxImpact.itemizedImpacts}
                keyExtractor={(_, index) => index.toString()}
              />
            </InfoBox>
          )}
          
          {/* Tax impact visualization chart */}
          <InfoBox title="Tax Impact Visualization" className="mt-6">
            <div className="h-24 flex items-end">
              {taxImpact.itemizedImpacts.map((impact, index) => {
                const barWidth = `${(impact.amount / (taxImpact.totalAdditionalIncome || 1)) * 100}%`;
                const barHeight = `${Math.min(100, (impact.effectiveTaxRate / 0.5) * 100)}%`;
                const colors = [
                  'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500'
                ];
                return (
                  <div key={index} className="flex flex-col items-center" style={{ width: barWidth }}>
                    <div 
                      className={`${colors[index % colors.length]} w-full mx-1`} 
                      style={{ height: barHeight }}
                    ></div>
                    <div className="text-xs mt-1 capitalize truncate w-full text-center">
                      {impact.itemType}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <div>0%</div>
              <div>Tax Rate</div>
              <div>50%+</div>
            </div>
          </InfoBox>
        </InfoBox>
      )}
    </Card>
  );
};

export default SpecialIncomeCalculator;
