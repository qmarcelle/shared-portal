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
}: CheckboxProps) => {
  const checkboxId =
    id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = () => {
    if (!disabled) {
      onChange?.(!checked);
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
      aria-checked={checked}
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
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          required={required}
          className={`checkbox ${checked ? 'checked' : ''} ${
            disabled ? 'disabled' : ''
          } ${error ? 'error' : ''}`}
          aria-label={label}
        />
        <label htmlFor={checkboxId} className="ml-2">
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
