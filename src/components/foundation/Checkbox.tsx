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
}

export const Checkbox = ({
  label,
  body,
  callback,
  selected,
  classProps,
  className,
  id = Math.random().toString(36).substring(2, 9),
}: CheckboxProps) => {
  const isDisabled = callback == null;

  return (
    <div
      className={`flex flex-row gap-2 p-2 ${isDisabled ? 'checkbox-disabled' : ''} ${className ?? ''}`}
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
      />
      <Column>
        <label htmlFor={id} id={`${id}-label`} className={classProps}>
          {label}
        </label>
        {body}
      </Column>
    </div>
  );
};
