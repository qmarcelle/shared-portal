import React, { useState } from 'react';

interface TextFieldProps {
  label: string;
  type?: string;
  valueCallback: (value: string) => void;
  onFocusCallback?: () => void;
  highlightError?: boolean;
  errors?: string[];
  isSuffixNeeded?: boolean;
  className?: string;
  placeholder?: string;
  defaultValue?: string;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  type = 'text',
  valueCallback,
  onFocusCallback,
  highlightError = true,
  errors = [],
  isSuffixNeeded = false,
  className = '',
  placeholder = '',
  defaultValue = '',
}) => {
  const [value, setValue] = useState(defaultValue);
  const hasErrors = errors && errors.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    valueCallback(newValue);
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onFocus={onFocusCallback}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${
            hasErrors && highlightError ? 'border-red-500' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        />
        {isSuffixNeeded && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {/* Suffix content if needed */}
          </div>
        )}
      </div>
      {hasErrors && (
        <div className="mt-1 text-sm text-red-600">
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};