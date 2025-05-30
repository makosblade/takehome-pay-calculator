import type { CalculationResult } from '../types';
import Card from './Card';
import KeyValuePair from './KeyValuePair';
import { formatCurrency, formatPercent } from '../services/formattingService';

interface TaxCalculationResultsProps {
  result: CalculationResult | null;
  payPeriod: string;
}

const TaxCalculationResults = ({ result, payPeriod }: TaxCalculationResultsProps) => {
  if (!result) return null;

  const payPeriodLabel = 
    payPeriod === 'annual' ? 'Annual' :
    payPeriod === 'monthly' ? 'Monthly' :
    payPeriod === 'biweekly' ? 'Bi-weekly' :
    'Weekly';

  return (
    <Card className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Take-Home Pay Results</h2>
      <p className="text-sm text-gray-500 mb-6">All amounts shown are {payPeriodLabel.toLowerCase()}</p>
      
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-lg font-medium text-gray-900">Gross Income:</h4>
        <span className="text-xl font-bold">{formatCurrency(result.grossIncome)}</span>
      </div>
      
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-gray-500">Tax Breakdown</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <KeyValuePair
          label="Federal Income Tax:"
          value={formatCurrency(result.federalTax)}
        />
        
        <KeyValuePair
          label="State Income Tax:"
          value={formatCurrency(result.stateTax)}
        />
        
        <KeyValuePair
          label="City/Local Tax:"
          value={formatCurrency(result.cityTax)}
        />
        
        <KeyValuePair
          label="Social Security (FICA):"
          value={formatCurrency(result.ficaTax)}
        />
        
        <KeyValuePair
          label="Medicare:"
          value={formatCurrency(result.medicareTax)}
        />
      </div>
      
      <div className="border-t border-gray-200 my-6"></div>
      
      <KeyValuePair
        label="Total Tax:"
        value={formatCurrency(result.totalTax)}
        isHighlighted={true}
        className="mb-2"
      />
      
      <KeyValuePair
        label="Effective Tax Rate:"
        value={formatPercent(result.effectiveTaxRate, 2)}
        valueClassName="badge-blue"
        className="mb-2"
      />
      
      <div className="border-t border-gray-200 my-6"></div>
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Take-Home Pay:</h3>
        <span className="text-lg font-semibold text-green-600">{formatCurrency(result.netIncome)}</span>
      </div>
    </Card>
  );
};

export default TaxCalculationResults;
