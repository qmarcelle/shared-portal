import { IComponent } from '../IComponent';

interface TextBoxProps extends IComponent {
  text: string;
  type?: 'title-1' | 'title-2' | 'title-3' | 'body-1' | 'body-2';
  styleProps?: object;
}

export const TextBox = ({
  text,
  styleProps,
  type = 'body-1',
  className = '',
}: TextBoxProps) => {
  return (
    <p style={styleProps} className={`${type} ${className}`.trimEnd()}>
      {text}
    </p>
  );
};
