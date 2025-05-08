import { ReactNode, useEffect, useState } from 'react';
import { IComponent } from '../IComponent';

export interface CheckboxProps extends IComponent {
  selected?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: (val: any) => void;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  classProps?: string;
  checkProps?: string;
  body?: ReactNode;
  disabled?: boolean;
  checked?: boolean;
  onChange?: (val: boolean) => void;
  className?: string;
  required?: boolean;
  error?: boolean;
  errorMessage?: string;
  id?: string;
}

export const Checkbox = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
  required = false,
  error = false,
  errorMessage,
  id,
}: CheckboxProps) => {
  const [isChecked, setIsChecked] = useState(checked);
  const checkboxId =
    id ||
    (process.env.NODE_ENV === 'test'
      ? `checkbox-test-${label.toLowerCase().replace(/\s+/g, '-')}`
      : `checkbox-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = () => {
    if (!disabled) {
      setIsChecked(!isChecked);
      onChange?.(!isChecked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChange();
    }
  };

  return (
    <div
      className={`flex flex-col ${className}`}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={disabled}
      aria-invalid={error}
      aria-required={required}
      aria-describedby={error ? `${checkboxId}-error` : undefined}
    >
      <div
        className="flex flex-row items-center"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handleChange}
      >
        <input
          type="checkbox"
          id={checkboxId}
          checked={isChecked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`checkbox ${isChecked ? 'checked' : ''} ${
            disabled ? 'disabled' : ''
          } ${error ? 'error' : ''}`}
          aria-label={label}
        />
        <label htmlFor={checkboxId} className="ml-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>
      {error && errorMessage && (
        <div
          id={`${checkboxId}-error`}
          className="text-red-500 text-sm mt-1"
          role="alert"
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};
