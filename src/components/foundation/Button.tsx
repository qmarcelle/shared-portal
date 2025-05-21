import { ReactNode } from 'react';
import { IComponent } from '../IComponent';
type ButtonType =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'rounded'
  | 'pill'
  | 'elevated'
  | 'card';

type ButtonStyle = 'button' | 'submit' | 'reset';

interface ButtonProps extends IComponent {
  type?: ButtonType;
  style?: ButtonStyle;
  id?: string;
  label?: string;
  icon?: ReactNode;
  callback?: () => void | Promise<void> | null | Promise<string>;
  disable?: boolean;
}

export const Button = ({
  type = 'primary',
  style = 'button',
  label,
  icon,
  id,
  className,
  callback,
  disable = false,
}: ButtonProps) => {
  function computeContent() {
    if (label) {
      return (
        <>
          {label}
          {icon && <p className="ml-2">{icon}</p>}
        </>
      );
    } else {
      return icon;
    }
  }

  return (
    <button
      onClick={callback}
      aria-label={label}
      className={`button-text ${type} text-center flex flex-row justify-center items-center min-w-fit ${callback == null || disable ? 'inactive' : null} ${className}`}
      type={style}
      id={id}
      disabled={disable || (!callback ? true : false)}
    >
      {computeContent()}
    </button>
  );
};
