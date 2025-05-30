import React from 'react';
import { generate83bElectionChecklist } from '../../services/stockOptionService';
import Card from '../../components/Card';

interface Election83bChecklistProps {
  exerciseDate: Date;
}

/**
 * Component that displays a checklist for completing an 83(b) election
 */
const Election83bChecklist: React.FC<Election83bChecklistProps> = ({ exerciseDate }) => {
  const { deadlineDate, steps } = generate83bElectionChecklist(exerciseDate);
  
  return (
    <Card title="83(b) Election Checklist" className="bg-blue-50 border border-blue-200">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-blue-800">Filing Deadline</h3>
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {deadlineDate.toLocaleDateString()}
          </span>
        </div>
        <p className="text-sm text-blue-700 mt-1">
          You must file your 83(b) election with the IRS within 30 days of the exercise date. This deadline is strict and cannot be extended.
        </p>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="p-3 bg-white rounded-md shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-semibold text-sm">
                {index + 1}
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium text-gray-900 flex items-center">
                  {step.step}
                  {step.isRequired && (
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs">Required</span>
                  )}
                </h4>
                <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                {step.deadline && (
                  <p className="mt-1 text-xs text-red-600">
                    Deadline: {step.deadline.toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-sm font-medium text-yellow-800">Important Notes</h3>
        <ul className="mt-2 text-sm text-yellow-700 list-disc list-inside space-y-1">
          <li>The 30-day deadline is strict and cannot be extended for any reason.</li>
          <li>It's recommended to send your election via certified mail with return receipt requested.</li>
          <li>Keep a copy of the election form and proof of mailing indefinitely.</li>
          <li>Consult with a tax professional before making an 83(b) election.</li>
          <li>An 83(b) election cannot be revoked except in very limited circumstances.</li>
        </ul>
      </div>
    </Card>
  );
};

export default Election83bChecklist;
