import { IComponent } from '../IComponent';

export interface TextBoxProps extends IComponent {
  text: string;
  type?: string;
  ariaLabel?: string;
  id?: string;
  display?: 'inline' | 'block';
  tabFocus?: number;
}

export const TextBox = ({
  text,
  type,
  className,
  ariaLabel,
  id,
  display = 'block',
  tabFocus,
}: TextBoxProps) => {
  return (
    <p
      className={`${type || 'body-1'} ${className || ''} ${display === 'inline' ? 'inline' : 'block'}`}
      aria-label={ariaLabel}
      id={id}
      tabIndex={tabFocus}
    >
      {text}
    </p>
  );
};
