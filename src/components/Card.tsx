import React, { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  variant = 'default'
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'info':
        return 'bg-blue-50';
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className={`p-6 rounded-lg shadow-md ${getVariantClasses()} ${className}`}>
      {title && <h3 className="text-xl font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;
