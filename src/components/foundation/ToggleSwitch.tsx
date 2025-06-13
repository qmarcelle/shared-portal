import { useState } from 'react';
import { IComponent } from '../IComponent';

type ToggleSwitchProps = {
  onToggleCallback?: () => void;
  initChecked?: boolean;
  disableToggle?: boolean;
} & IComponent;

export const ToggleSwitch = ({
  initChecked = false,
  onToggleCallback,
  ariaLabel = 'switch',
  disableToggle = false,
}: ToggleSwitchProps) => {
  const [checkedState, setChecked] = useState(initChecked);

  const onToggle = () => {
    if (disableToggle) return;
    console.log('OnToggle called');
    setChecked(!checkedState);
    onToggleCallback?.();
  };

  const handleKeyDown = (e: { keyCode: number }) => {
    if (e.keyCode === 13) {
      onToggle();
    }
  };

  return (
    <label
      aria-label={ariaLabel}
      className="switch"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <input type="checkbox" onChange={onToggle} checked={checkedState} />
      <div
        className={`flex items-center toggle-slider round ${checkedState ? 'justify-start' : 'justify-end'}`}
      >
        <p
          className={`${checkedState ? 'hidden' : 'block'} text-primary mt-[6px] mr-[6px] body-1`}
        >
          OFF
        </p>
        <p
          className={`${checkedState ? 'block' : 'hidden'} text-white mt-1 ml-2 body-1`}
        >
          ON
        </p>
      </div>
    </label>
  );
};
