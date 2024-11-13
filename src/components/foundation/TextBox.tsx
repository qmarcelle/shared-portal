import { IComponent } from '../IComponent';

interface TextBoxProps extends IComponent {
  text: string;
  tabFocus?: number;
  type?: 'title-1' | 'title-2' | 'title-3' | 'body-1' | 'body-2';
}

export const TextBox = ({
  text,
  type = 'body-1',
  tabFocus,
  className = '',
}: TextBoxProps) => {
  return (
    <p className={`${type} ${className}`.trimEnd()} tabIndex={tabFocus}>
      {text}
    </p>
  );
};
