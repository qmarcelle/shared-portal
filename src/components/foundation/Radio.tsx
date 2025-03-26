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
  classProps,
  className,
  ariaLabel,
  childBuilder,
}: RadioProps) => {
  const radioId = `radio-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div
      className={`flex flex-row gap-2 p-2 ${callback == null ? 'radio-disabled' : ''} ${className ?? ''}`}
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel || label}
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
          type="radio"
          id={radioId}
          onChange={callback}
          checked={selected}
          disabled={callback == null}
          className="sr-only"
          aria-label={ariaLabel || label}
        />
        <div
          className={`w-5 h-5 border rounded-full ${
            selected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
          } ${callback == null ? 'opacity-50' : ''}`}
          aria-hidden="true"
        >
          {selected && <div className="w-2 h-2 bg-white rounded-full m-1.5" />}
        </div>
      </label>
      <Column>
        <label htmlFor={radioId} className="cursor-pointer">
          <p className={classProps}>{label}</p>
        </label>
        {subLabel && <p className="text-sm text-gray-500 mt-1">{subLabel}</p>}
        {childBuilder && childBuilder(selected)}
        {body}
      </Column>
    </div>
  );
};
