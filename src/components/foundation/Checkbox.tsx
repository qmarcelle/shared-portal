import { ReactNode } from 'react';
import { IComponent } from '../IComponent';
import { Column } from './Column';

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
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

export const Checkbox = ({
  label,
  body,
  callback,
  selected,
  classProps,
  className,
  id = Math.random().toString(36).substring(2, 9),
  ariaLabel,
  ariaDescribedBy,
}: CheckboxProps) => {
  const isDisabled = callback == null;

  return (
    <div
      className={`flex flex-row gap-2 p-2 ${isDisabled ? 'checkbox-disabled' : ''} ${className ?? ''}`}
      role="checkbox"
      aria-checked={!!selected}
      aria-label={ariaLabel || label}
      aria-describedby={ariaDescribedBy}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          callback?.(!selected);
        }
      }}
    >
      <input
        type="checkbox"
        name={id}
        id={id}
        onChange={callback}
        checked={selected}
        disabled={isDisabled}
        aria-checked={!!selected}
        aria-disabled={isDisabled}
        aria-labelledby={`${id}-label`}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 border rounded ${
          selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
        } ${isDisabled ? 'opacity-50' : ''}`}
        aria-hidden="true"
      >
        {selected && (
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <Column>
        <label
          htmlFor={id}
          id={`${id}-label`}
          className={`cursor-pointer ${classProps || ''}`}
        >
          {label}
        </label>
        {body}
      </Column>
    </div>
  );
};
