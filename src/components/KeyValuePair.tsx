import React, { ReactNode } from 'react';

interface KeyValuePairProps {
  label: string;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
  isHighlighted?: boolean;
}

const KeyValuePair: React.FC<KeyValuePairProps> = ({
  label,
  value,
  className = '',
  labelClassName = '',
  valueClassName = '',
  isHighlighted = false
}) => {
  return (
    <div className={`flex justify-between ${isHighlighted ? 'font-medium' : ''} ${className}`}>
      <span className={`text-gray-600 ${labelClassName}`}>{label}</span>
      <span className={`${isHighlighted ? 'font-medium' : ''} ${valueClassName}`}>{value}</span>
    </div>
  );
};

export default KeyValuePair;
