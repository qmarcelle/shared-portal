import { IComponent } from '../IComponent';

interface TextBoxProps extends IComponent {
  text: string;
  type?: 'title-1' | 'title-2' | 'title-3' | 'body-1' | 'body-2';
}

export const TextBox = ({
  text,
  type = 'body-1',
  className = '',
}: TextBoxProps) => {
  if (type == 'title-1') {
    return <h1 className={`${type} ${className}`.trimEnd()}>{text}</h1>;
  } else if (type == 'title-2') {
    return <h2 className={`${type} ${className}`.trimEnd()}>{text}</h2>;
  } else if (type == 'title-3') {
    return <h3 className={`${type} ${className}`.trimEnd()}>{text}</h3>;
  }
  return <p className={`${type} ${className}`.trimEnd()}>{text}</p>;
};
