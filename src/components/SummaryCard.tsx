import React, { ReactNode } from 'react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  variant = 'default',
  className = ''
}) => {
  const getVariantClasses = (): { bg: string; text: string } => {
    switch (variant) {
      case 'success':
        return { bg: 'bg-green-50', text: 'text-green-700' };
      case 'warning':
        return { bg: 'bg-amber-50', text: 'text-amber-700' };
      case 'danger':
        return { bg: 'bg-red-50', text: 'text-red-700' };
      case 'info':
        return { bg: 'bg-blue-50', text: 'text-blue-700' };
      default:
        return { bg: 'bg-gray-50', text: 'text-gray-700' };
    }
  };

  const { bg, text } = getVariantClasses();

  return (
    <div className={`${bg} p-4 rounded-lg ${className}`}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className={`text-2xl font-bold ${text}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {value}
      </div>
      {subtitle && <div className="text-sm mt-1">{subtitle}</div>}
    </div>
  );
};

export default SummaryCard;
