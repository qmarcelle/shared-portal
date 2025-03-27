import { ReactElement } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface RadioProps {
  selected: boolean;
  callback?: ((val: any) => void) | null;
  label: string;
  subLabel?: string;
  childBuilder?: (selected: boolean) => ReactElement | undefined;
  value?: any;
  id?: string;
}

export const Radio = ({
  selected,
  label,
  childBuilder,
  callback,
  value,
  subLabel,
  id = Math.random().toString(36).substring(2, 9),
}: RadioProps) => {
  return (
    <div
      onClick={() => callback?.(value)}
      className={`flex flex-row gap-1 ${callback == null ? 'checkbox-disabled' : ''}`}
    >
      <input
        type="radio"
        name={id}
        id={id}
        checked={selected}
        onChange={() => callback?.(value)}
        aria-checked={selected}
        disabled={callback == null}
        aria-disabled={callback == null}
      />
      <div className="flex-col m-1">
        <label
          htmlFor={id}
          className={`${subLabel != null ? 'font-bold' : ''}`}
        >
          {label}
        </label>
        {subLabel && <p>{subLabel}</p>}
        {childBuilder && childBuilder(selected)}
      </div>
    </div>
  );
};
