import React from 'react';
import Button from '../../components/Button';

interface ResultsActionsProps {
  onReset: () => void;
}

const ResultsActions: React.FC<ResultsActionsProps> = ({
  onReset
}) => {
  return (
    <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-200">
      <div>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={onReset}
          className="mr-3"
        >
          Start Over
        </Button>
        <Button 
          type="button" 
          variant="primary"
          onClick={() => window.print()}
        >
          Print Results
        </Button>
      </div>
      <div>
        <Button 
          type="button" 
          variant="info"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
};

export default ResultsActions;
