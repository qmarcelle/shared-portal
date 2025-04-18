import { ReactNode } from 'react';
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
  ariaLabel?: string;
  ariaDescribedBy?: string;
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
  body,
  // Support for backward compatibility
  selected,
  callback,
  classProps,
  checkProps,
  ariaLabel,
  ariaDescribedBy,
}: CheckboxProps) => {
  // Support both new and old prop patterns
  const isChecked = selected !== undefined ? selected : checked;
  const isDisabled = disabled || callback === null;
  const handleCallback = onChange || callback;

  const checkboxId =
    id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = () => {
    if (!isDisabled && handleCallback) {
      handleCallback(!isChecked);
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
      className={`flex flex-col ${className || ''} ${callback === null ? 'checkbox-disabled' : ''}`}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      aria-invalid={error}
      aria-required={required}
      aria-label={ariaLabel || undefined}
      aria-describedby={
        ariaDescribedBy || (error ? `${checkboxId}-error` : undefined)
      }
    >
      <div
        className="flex flex-row items-center"
        tabIndex={isDisabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onClick={handleChange}
      >
        <input
          type="checkbox"
          id={checkboxId}
          checked={isChecked}
          onChange={handleChange}
          disabled={isDisabled}
          required={required}
          className={`checkbox ${checkProps || ''} ${isChecked ? 'checked' : ''} ${
            isDisabled ? 'disabled' : ''
          } ${error ? 'error' : ''}`}
          aria-label={ariaLabel || label}
        />
        <label htmlFor={checkboxId} className={`ml-2 ${classProps || ''}`}>
          {body ? body : label}
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
