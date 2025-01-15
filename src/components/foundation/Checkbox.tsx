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
}

export const Checkbox = ({
  label,
  body,
  callback,
  selected,
  classProps,
  className,
}: CheckboxProps) => {
  return (
    <div
      className={`flex flex-row gap-2 p-2  ${callback == null ? 'checkbox-disabled' : ''} ${className ?? ''}`}
    >
      <label>
        <input
          type="checkbox"
          name=""
          id="myCheckbox"
          onChange={callback}
          checked={selected}
        />
      </label>
      <Column>
        <label htmlFor="myCheckbox">
          <p className={classProps}>{label}</p>
        </label>
        {body}
      </Column>
    </div>
  );
};
