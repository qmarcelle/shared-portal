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
  ariaLabel,
  ariaDescribedBy,
}: CheckboxProps) => {
  const checkboxId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`flex flex-row gap-2 p-2 ${callback == null ? 'checkbox-disabled' : ''} ${className ?? ''}`}
      role="checkbox"
      aria-checked={selected}
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
      <label className="flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          onChange={callback}
          checked={selected}
          disabled={callback == null}
          className="sr-only"
          aria-label={ariaLabel || label}
        />
        <div
          className={`w-5 h-5 border rounded ${
            selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
          } ${callback == null ? 'opacity-50' : ''}`}
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
      </label>
      <Column>
        <label htmlFor={checkboxId} className="cursor-pointer">
          <p className={classProps}>{label}</p>
        </label>
        {body}
      </Column>
    </div>
  );
};
