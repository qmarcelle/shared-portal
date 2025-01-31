import { IComponent } from '../IComponent';

interface TextBoxProps extends IComponent {
  text: string;
  tabFocus?: number;
  display?: 'block' | 'inline';
  type?: 'title-1' | 'title-2' | 'title-3' | 'body-1' | 'body-2';
}

export const TextBox = ({
  text,
  type = 'body-1',
  tabFocus,
  className = '',
  display = 'block',
}: TextBoxProps) => {
  return (
    <p
      className={`${type} ${className}`.trimEnd()}
      tabIndex={tabFocus}
      style={{ display: display }}
    >
      {text}
    </p>
  );
};
