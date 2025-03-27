import React from 'react';
import { IComponent } from '../IComponent';
import { Column } from './Column';

export interface RadioProps extends IComponent {
  selected?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  callback?: (val: any) => void;
  label: string;
  subLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value?: any;
  id?: string;
  classProps?: string;
  body?: React.ReactNode;
  ariaLabel?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  childBuilder?: (selected: any) => React.ReactNode;
}

export const Radio = ({
  label,
  subLabel,
  body,
  callback,
  selected,
  value,
  classProps,
  className,
  ariaLabel,
  childBuilder,
  id = `radio-${Math.random().toString(36).substring(2, 9)}`,
}: RadioProps) => {
  const isDisabled = callback == null;

  return (
    <div
      className={`flex flex-row gap-2 p-2 ${isDisabled ? 'radio-disabled' : ''} ${className ?? ''}`}
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel || label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          callback?.(value);
        }
      }}
    >
      <input
        type="radio"
        name={id}
        id={id}
        checked={selected}
        onChange={() => callback?.(value)}
        aria-checked={!!selected}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        className="sr-only"
      />
      <div
        className={`w-5 h-5 border rounded-full ${
          selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
        } ${isDisabled ? 'opacity-50' : ''}`}
        aria-hidden="true"
      >
        {selected && <div className="w-2 h-2 bg-white rounded-full m-1.5" />}
      </div>
      <Column>
        <label
          htmlFor={id}
          className={`cursor-pointer ${subLabel != null ? 'font-bold' : ''} ${classProps || ''}`}
        >
          {label}
        </label>
        {subLabel && <p className="text-sm text-gray-500 mt-1">{subLabel}</p>}
        {childBuilder && childBuilder(selected)}
        {body}
      </Column>
    </div>
  );
};
