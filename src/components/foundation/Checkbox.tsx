import { ReactNode, useCallback, memo } from 'react';
import { IComponent } from '../IComponent';

export interface CheckboxProps extends IComponent {
  selected?: boolean;
  callback?: (val: boolean) => void;
  label: string;
  value?: string | number | boolean;
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

const inputClassName = `checkbox ${checkProps || ''} ${isChecked ? 'checked checkbox--checked' : ''} ${
  isDisabled ? 'disabled checkbox--disabled' : ''
} ${error ? 'error checkbox--error' : ''}`;

export const Checkbox = memo(({  // Wrap component with React.memo
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
  const isChecked = checked ?? selected ?? false;
  const isDisabled = disabled || !callback;
  const handleCallback = onChange || callback;

  const checkboxId =
    id || `checkbox-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const handleChange = useCallback(() => {
    if (!isDisabled && handleCallback) {
      handleCallback(!isChecked);
    }
  }, [isDisabled, handleCallback, isChecked]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleChange();
    }
  }, [handleChange]);

  return (
    <div
      className={`flex flex-col ${className || ''} ${callback === null ? 'checkbox-disabled' : ''}`}
      role="checkbox"
      aria-checked={isChecked}
      aria-disabled={isDisabled}
      aria-invalid={error}
      aria-required={required}
      aria-label={ariaLabel || label || 'Checkbox'} // Ensure fallback for aria-label
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
          className={inputClassName} // Use updated inputClassName
          aria-label={ariaLabel || label}
        />
        <label htmlFor={checkboxId} className={`ml-2 ${classProps || ''}`}>
          {body ? (
            <>
              {body}
              {/* Keep label text for screen readers */}
              <span className="sr-only">{label}</span>
            </>
          ) : label}
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
});
