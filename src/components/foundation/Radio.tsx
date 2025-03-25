/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RadioProps {
  selected: boolean;
  label: string;
  callback?: (value?: string) => void;
  value?: string;
  subLabel?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const Radio = ({
  selected,
  label,
  callback,
  value,
  subLabel,
  disabled = false,
  ariaLabel,
}: RadioProps) => {
  const id = `radio-${Math.random().toString(36).substring(2, 9)}`;

  const handleClick = () => {
    if (!disabled && callback) {
      callback(value);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex flex-row gap-1 ${disabled ? 'opacity-50 cursor-not-allowed' : callback ? 'cursor-pointer' : ''}`}
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && callback) {
          e.preventDefault();
          callback(value);
        }
      }}
    >
      <label htmlFor={id}>
        <input
          type="radio"
          name=""
          id={id}
          checked={selected}
          onChange={() => {}} // Handled by div onClick
          disabled={disabled}
          aria-label={ariaLabel || label}
          aria-checked={selected}
        />
      </label>
      <div className="flex-col mb-3">
        <p className={`${subLabel != null ? 'font-bold' : ''}`}>{label}</p>
        {subLabel && <p>{subLabel}</p>}
      </div>
    </div>
  );
};
