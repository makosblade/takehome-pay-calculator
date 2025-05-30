import React, { ReactNode } from 'react';

interface InfoBoxProps {
  title?: string;
  children: ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
  className?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
  title,
  children,
  variant = 'info',
  icon,
  className = ''
}) => {
  const getVariantClasses = (): { bg: string; border: string; title: string } => {
    switch (variant) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          title: 'text-green-800'
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          title: 'text-yellow-800'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          title: 'text-red-800'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          title: 'text-blue-800'
        };
    }
  };

  const { bg, border, title: titleColor } = getVariantClasses();

  return (
    <div className={`${bg} p-4 rounded-md border ${border} ${className}`}>
      {title && (
        <h4 className={`font-medium ${titleColor} mb-2 flex items-center`}>
          {icon && <span className="mr-2">{icon}</span>}
          {title}
        </h4>
      )}
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default InfoBox;
