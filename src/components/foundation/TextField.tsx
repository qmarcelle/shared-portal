import React, { ChangeEvent, useRef, useState } from 'react';
import { IComponent } from '../IComponent';

export interface TextFieldProps extends IComponent {
  label?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: string[];
  valueCallback?: (value: string) => void;
  onKeydownCallback?: (value: string) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  maxLength?: number;
  pattern?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search';
  ariaLabel?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
}

export const TextField = ({
  label,
  value = '',
  placeholder,
  type = 'text',
  required = false,
  disabled = false,
  errors = [],
  valueCallback,
  onKeydownCallback,
  inputRef,
  className = '',
  maxLength,
  pattern,
  inputMode,
  ariaLabel,
  ariaDescribedBy,
  ariaInvalid,
}: TextFieldProps) => {
  const localInputRef = useRef<HTMLInputElement>(null);
  const actualInputRef = inputRef || localInputRef;
  const [isFocused, setIsFocused] = useState(false);

  const fieldId = label
    ? `input-${label.replace(/\s+/g, '-').toLowerCase()}`
    : `input-${Math.random().toString(36).substring(2, 9)}`;
  const errorId = `${fieldId}-error`;
  const descriptionId =
    ariaDescribedBy || (errors.length > 0 ? errorId : undefined);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    valueCallback?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeydownCallback?.(e.currentTarget.value);
  };

  const hasError = errors.length > 0;

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          htmlFor={fieldId}
          className={`mb-1 ${required ? 'required-field after:content-["*"] after:ml-1 after:text-red-500' : ''}`}
        >
          {label}
        </label>
      )}
      <input
        id={fieldId}
        type={type}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        pattern={pattern}
        inputMode={inputMode}
        ref={actualInputRef}
        aria-label={ariaLabel || label}
        aria-required={required}
        aria-invalid={ariaInvalid || hasError}
        aria-describedby={descriptionId}
        className={`input ${hasError ? 'error-input' : ''} ${isFocused ? 'input-focus' : ''}`}
      />
      {hasError && (
        <div id={errorId} className="error-container" role="alert">
          {errors[0]}
        </div>
      )}
    </div>
  );
};
