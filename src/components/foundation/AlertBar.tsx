import { useState } from 'react';
import AlertIcon from '../../../public/assets/alert_white.svg';
import CloseIcon from '../../../public/assets/close_white.svg';
import { IComponent } from '../IComponent';

interface AlertBarProps extends IComponent {
  alerts: string[];
  role?: string;
  'aria-label'?: string;
}

const AlertTile = ({
  index,
  label,
  closeCallback,
}: {
  index: number;
  label: string;
  closeCallback: (index: number) => void;
}) => {
  // Convert SVG components to a format compatible with next/image
  // This uses double type assertion to safely convert SVG components
  const alertIconSrc = AlertIcon as unknown as { src: string };
  const closeIconSrc = CloseIcon as unknown as { src: string };

  return (
    <div className="flex flex-row py-1 px-2 w-full alert-tile">
      <div>
        <Image src={AlertIcon} className="icon" alt="" />
      </div>
      <p className="mx-1 grow">{label}</p>
      <div onClick={() => closeCallback(index)}>
        <Image src={CloseIcon} className="icon" alt="" />
      </div>
    </div>
  );
};

export const AlertBar = ({
  alerts,
  role,
  'aria-label': ariaLabel,
}: AlertBarProps) => {
  const [items, setItems] = useState(alerts);

  const closeCallback = (index: number) => {
    items.splice(index, 1);
    setItems([...items]);
  };

  if (items.length == 0) {
    return null;
  }

  if (items.length == 1) {
    return (
      <AlertTile
        key={items[0]}
        index={0}
        label={items[0]}
        closeCallback={closeCallback}
      />
    );
  } else {
    return (
      <div
        className="flex flex-col self-stretch"
        role={role}
        aria-label={ariaLabel}
      >
        {items.map((item, index) => {
          if (index != alerts.length - 1) {
            return (
              <div key={index}>
                <AlertTile
                  key={item}
                  index={index}
                  label={item}
                  closeCallback={closeCallback}
                />
                <div className="divider"></div>
              </div>
            );
          } else {
            return (
              <AlertTile
                key={item}
                index={index}
                label={item}
                closeCallback={closeCallback}
              />
            );
          }
        })}
      </div>
    );
  }
};
