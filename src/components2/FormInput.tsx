import React from 'react';

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'number' | 'select' | 'checkbox';
  value: string | number | boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  className?: string;
  onlyNumbers?: boolean;
  helpText?: string;
  checked?: boolean;
  step?: string; // Added step prop for number inputs
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  options = [],
  className = '',
  onlyNumbers = false,
  helpText,
  checked,
  step,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onlyNumbers) {
      const numericValue = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = numericValue;
    }
    onChange(e);
  };

  return (
    <div className={`form-group ${className}`}>
      <label className="block text-sm font-medium mb-1" style={{ color: 'var(--neutral-700)' }}>
        {label}
        {required && <span style={{ color: 'var(--error)' }} className="ml-1">*</span>}
      </label>
      
      {type === 'select' ? (
        <select
          name={name}
          className="form-select form-input"
          style={{
            borderColor: error ? 'var(--error)' : 'var(--neutral-300)',
            boxShadow: error ? '0 0 0 1px var(--error)' : 'none'
          }}
          value={value.toString()}
          onChange={onChange}
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'checkbox' ? (
        <div className="flex items-center">
          <input
            type="checkbox"
            name={name}
            className="form-checkbox"
            style={{
              accentColor: 'var(--primary-600)',
              borderColor: 'var(--neutral-400)'
            }}
            checked={checked !== undefined ? checked : Boolean(value)}
            onChange={onChange}
          />
          <span className="ml-2 text-sm" style={{ color: 'var(--neutral-600)' }}>{placeholder}</span>
        </div>
      ) : (
        <input
          type={type}
          name={name}
          className="form-input"
          style={{
            borderColor: error ? 'var(--error)' : 'var(--neutral-300)',
            boxShadow: error ? '0 0 0 1px var(--error)' : 'none'
          }}
          placeholder={placeholder}
          value={value.toString() === '0' && type === 'number' ? '' : value.toString()}
          onChange={onlyNumbers ? handleChange : onChange}
          required={required}
          step={type === 'number' ? step : undefined}
        />
      )}
      
      {error && <p className="text-sm mt-1" style={{ color: 'var(--error)' }}>{error}</p>}
      {helpText && <p className="text-xs mt-1" style={{ color: 'var(--neutral-500)' }}>{helpText}</p>}
    </div>
  );
};

export default FormInput;
