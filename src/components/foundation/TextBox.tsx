import { IComponent } from '../IComponent';
import { resolveMaxWidth } from '../MaxWidthResolver';

interface TextBoxProps extends IComponent {
  text: string;
  tabFocus?: number;
  display?: 'block' | 'inline';
  type?: 'title-1' | 'title-2' | 'title-3' | 'body-1' | 'body-2';
  maxWidth?: string | number;
  isRequiredLabel?: boolean;
}

export const TextBox = ({
  text,
  type = 'body-1',
  tabFocus,
  className = '',
  display = 'block',
  maxWidth = '100%',
  isRequiredLabel = false,
}: TextBoxProps) => {
  if (type == 'title-1') {
    return <h1 className={`${type} ${className}`.trimEnd()}>{text}</h1>;
  } else if (type == 'title-2') {
    return <h2 className={`${type} ${className}`.trimEnd()}>{text}</h2>;
  } else if (type == 'title-3') {
    return <h3 className={`${type} ${className}`.trimEnd()}>{text}</h3>;
  }
  const resolvedMaxWidth = resolveMaxWidth(maxWidth);
  return (
    <p
      className={`${type} ${className}`.trimEnd()}
      tabIndex={tabFocus}
      style={{
        display: display,
        ...(resolvedMaxWidth && { maxWidth: resolvedMaxWidth }),
      }}
    >
      {isRequiredLabel && <span className="text-red-500 ml-1">* </span>}
      {text}
    </p>
  );
};
