import React from 'react';
import { IComponent } from '../IComponent';

export interface CheckboxProps extends IComponent {
  label?: string;
  body?: React.ReactNode;
  selected?: boolean;
  callback?: (value?: string) => void;
  value?: string;
  classProps?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const Checkbox = ({
  label,
  body,
  selected = false,
  callback,
  value,
  classProps = '',
  className = '',
  disabled = false,
  ariaLabel,
}: CheckboxProps) => {
  const id = `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  const handleClick = () => {
    if (!disabled && callback) {
      callback(value);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-row gap-1 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      role="checkbox"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          e.preventDefault();
          callback?.(value);
        }
      }}
    >
      <input
        type="checkbox"
        id={id}
        checked={selected}
        onChange={() => {}} // Handled by div onClick
        aria-checked={selected}
        aria-label={ariaLabel || label}
        aria-disabled={disabled}
        disabled={disabled}
        className="mt-1 mr-2"
      />
      <div className="flex-col mb-3">
        <label htmlFor={id} className={classProps}>
          {label}
        </label>
        {body && <div>{body}</div>}
      </div>
    </div>
  );
};
