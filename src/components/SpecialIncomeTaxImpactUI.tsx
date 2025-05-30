import React from 'react';
import type { SpecialIncomeItem } from '../types';
import Card from './Card';
import SummaryCard from './SummaryCard';
import InfoBox from './InfoBox';
import { formatCurrency, formatPercent, getTaxRateColorClass, getIncomeTypeIcon } from '../services/formattingService';

interface SpecialIncomeTaxImpactUIProps {
  taxImpact: {
    totalAdditionalIncome: number;
    totalAdditionalTax: number;
    totalWithholding: number;
    netTaxDue: number;
    blendedEffectiveRate: number;
    itemizedImpacts: {
      itemType: string;
      amount: number;
      additionalTax: number;
      effectiveTaxRate: number;
    }[];
  };
  specialIncomeItems: SpecialIncomeItem[];
}

const SpecialIncomeTaxImpactUI: React.FC<SpecialIncomeTaxImpactUIProps> = ({
  taxImpact,
  specialIncomeItems
}) => {

  return (
    <Card title="Special Income Tax Impact">
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          variant="info"
          label="Total Additional Income"
          value={formatCurrency(taxImpact.totalAdditionalIncome)}
        />
        
        <SummaryCard
          variant="warning"
          label="Total Additional Tax"
          value={formatCurrency(taxImpact.totalAdditionalTax)}
          subtitle={`Effective Rate: ${formatPercent(taxImpact.blendedEffectiveRate)}`}
        />
        
        <SummaryCard
          variant={taxImpact.netTaxDue > 0 ? 'danger' : 'success'}
          label={taxImpact.netTaxDue > 0 ? 'Additional Tax Due' : 'Tax Overpaid'}
          value={formatCurrency(Math.abs(taxImpact.netTaxDue))}
          subtitle={`Withholding: ${formatCurrency(taxImpact.totalWithholding)}`}
        />
      </div>
      
      {/* Detailed Breakdown */}
      <div className="mb-6">
        <h4 className="text-lg font-medium mb-3">Tax Impact by Income Type</h4>
        <div className="space-y-3">
          {taxImpact.itemizedImpacts.map((impact, index) => (
            <InfoBox key={index}>
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium flex items-center">
                  <span className="mr-2">{getIncomeTypeIcon(impact.itemType)}</span>
                  <span className="capitalize">{impact.itemType}</span>
                  {specialIncomeItems[index].description && (
                    <span className="ml-2 text-sm text-gray-500">
                      ({specialIncomeItems[index].description})
                    </span>
                  )}
                </div>
                <div className="text-sm">
                  <span className={getTaxRateColorClass(impact.effectiveTaxRate)}>
                    {formatPercent(impact.effectiveTaxRate)} tax rate
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between">
                <div className="text-sm">
                  Amount: <span className="font-medium">{formatCurrency(impact.amount)}</span>
                </div>
                <div className="text-sm">
                  Tax: <span className="font-medium">{formatCurrency(impact.additionalTax)}</span>
                </div>
                <div className="text-sm">
                  Withholding: <span className="font-medium">
                    {formatCurrency(specialIncomeItems[index].withholding)}
                  </span>
                </div>
                <div className="text-sm">
                  Net Due: <span className={`font-medium ${
                    impact.additionalTax - specialIncomeItems[index].withholding > 0 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {formatCurrency(Math.abs(impact.additionalTax - specialIncomeItems[index].withholding))}
                  </span>
                </div>
              </div>
            </InfoBox>
          ))}
        </div>
      </div>
      
      {/* Visualization */}
      <div>
        <h4 className="text-lg font-medium mb-3">Tax Impact Visualization</h4>
        <div className="relative h-60 border border-gray-200 rounded-lg p-4">
          {/* Y-axis label */}
          <div className="absolute -left-10 top-1/2 transform -rotate-90 text-sm text-gray-500">
            Tax Rate
          </div>
          
          {/* X-axis label */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-sm text-gray-500">
            Income Amount
          </div>
          
          {/* Chart */}
          <div className="flex items-end h-full w-full">
            {taxImpact.itemizedImpacts.map((impact, index) => {
              const barWidth = `${Math.max(10, (impact.amount / taxImpact.totalAdditionalIncome) * 100)}%`;
              const barHeight = `${Math.min(95, Math.max(5, impact.effectiveTaxRate * 200))}%`;
              const colors = [
                'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 
                'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
              ];
              
              return (
                <div 
                  key={index} 
                  className="flex flex-col items-center justify-end px-1" 
                  style={{ width: barWidth }}
                >
                  <div className="w-full flex flex-col items-center">
                    <div className="text-xs mb-1 text-center">
                      {formatPercent(impact.effectiveTaxRate)}
                    </div>
                    <div 
                      className={`${colors[index % colors.length]} w-full rounded-t-md relative group`}
                      style={{ height: barHeight }}
                    >
                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded whitespace-nowrap transition-opacity">
                        {impact.itemType}: {formatCurrency(impact.amount)}
                        <br />
                        Tax: {formatCurrency(impact.additionalTax)}
                      </div>
                    </div>
                    <div className="text-xs mt-1 capitalize truncate w-full text-center">
                      {impact.itemType}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis ticks */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <div>50%</div>
            <div>25%</div>
            <div>0%</div>
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {taxImpact.netTaxDue > 1000 && (
        <InfoBox
          variant="info"
          title="Recommendations"
          className="mt-6"
        >
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Consider increasing your withholding by {formatCurrency(taxImpact.netTaxDue / 12)} per month to cover the additional tax.
            </li>
            <li>
              For RSUs and bonuses, check if your employer is withholding at the correct supplemental rate (22% or 37% for income over $1M).
            </li>
            {taxImpact.itemizedImpacts.some(i => i.itemType === 'k1') && (
              <li>
                For K-1 income, consider making quarterly estimated tax payments to avoid underpayment penalties.
              </li>
            )}
            {taxImpact.itemizedImpacts.some(i => i.itemType === 'capitalGains' && i.effectiveTaxRate > 0.15) && (
              <li>
                For future capital gains, consider holding investments for more than a year to qualify for lower long-term capital gains rates.
              </li>
            )}
          </ul>
        </InfoBox>
      )}
    </Card>
  );
};

export default SpecialIncomeTaxImpactUI;
