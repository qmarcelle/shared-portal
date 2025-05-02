import { memo, ReactNode, useCallback } from 'react';
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

export const Checkbox = memo(
  ({
    // Keep label required for TypeScript but handle empty values gracefully
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
    // Validate required label prop but don't use default value to maintain type safety
    if (!label) {
      console.warn('Checkbox component requires a label prop');
    }

    // Support both new and old prop patterns
    const isChecked = checked ?? selected ?? false;

    // Preserve original disabled logic for maximum backward compatibility
    // but also support the new pattern with onChange
    const isDisabled =
      disabled || (callback === undefined && onChange === undefined);
    const handleCallback = onChange || callback;

    const checkboxId =
      id ||
      `checkbox-${(label || 'checkbox').toLowerCase().replace(/\s+/g, '-')}`;

    const inputClassName = `checkbox ${checkProps || ''} ${isChecked ? 'checked checkbox--checked' : ''} ${
      isDisabled ? 'disabled checkbox--disabled' : ''
    } ${error ? 'error checkbox--error' : ''}`;

    const handleChange = useCallback(() => {
      if (!isDisabled && handleCallback) {
        handleCallback(!isChecked);
      }
    }, [isDisabled, handleCallback, isChecked]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleChange();
        }
      },
      [handleChange],
    );

    return (
      <div
        className={`flex flex-col ${className || ''} ${callback === null ? 'checkbox-disabled' : ''} ${isDisabled ? 'checkbox-disabled' : ''}`}
        role="checkbox"
        aria-checked={isChecked}
        aria-disabled={isDisabled}
        aria-invalid={error}
        aria-required={required}
        aria-label={ariaLabel || label || 'Checkbox'}
        aria-describedby={
          ariaDescribedBy || (error ? `${checkboxId}-error` : undefined)
        }
        // Keep the onClick for backward compatibility with any code that might rely on it
        onClick={(e) => {
          // Only handle clicks on the container itself, not on its children
          if (e.target === e.currentTarget) {
            handleChange();
          }
        }}
      >
        <div
          className="flex flex-row items-baseline"
          tabIndex={isDisabled ? -1 : 0}
          onKeyDown={handleKeyDown}
        >
          <input
            type="checkbox"
            id={checkboxId}
            checked={isChecked}
            onChange={handleChange}
            disabled={isDisabled}
            required={required}
            className={inputClassName}
            aria-label={ariaLabel || label}
          />
          <label
            htmlFor={checkboxId}
            className={`ml-2 ${classProps || ''} ${isDisabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
          >
            {body ? (
              <>
                {body}
                <span className="sr-only">{label}</span>
              </>
            ) : (
              label
            )}
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
  },
);

Checkbox.displayName = 'Checkbox';
