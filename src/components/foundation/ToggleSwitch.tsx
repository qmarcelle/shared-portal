import { useState } from 'react';
import { IComponent } from '../IComponent';

type ToggleSwitchProps = {
  onToggleCallback?: () => void;
  initChecked?: boolean;
} & IComponent;

export const ToggleSwitch = ({
  initChecked = false,
  onToggleCallback,
  ariaLabel = 'switch',
}: ToggleSwitchProps) => {
  const [checkedState, setChecked] = useState(initChecked);

  const onToggle = () => {
    console.log('OnToggle called');
    setChecked(!checkedState);
    onToggleCallback?.();
  };

  console.log('Checked State', checkedState);

  return (
    <label aria-label={ariaLabel} className="switch">
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
