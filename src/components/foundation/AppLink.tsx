import { ReactNode } from 'react';
import { IComponent } from '../IComponent';

type ButtonType = 'default' | 'link' | 'button';

export interface LinkProps extends IComponent {
  url?: string;
  label: string;
  type?: ButtonType;
  linkIndex?: number;
  icon?: ReactNode | null;
  displayStyle?: string;
  linkUnderline?: string;
  callback?: () => void;
}

export const AppLink = ({
  label,
  icon,
  url,
  type = 'default',
  callback,
  className,
  linkUnderline,
  linkIndex,
  displayStyle = 'block',
}: LinkProps) => {
  if (type == 'default') {
    return (
      <a style={{ display: `${displayStyle}` }} href={url} aria-label={label}>
        <button
          onClick={callback}
          tabIndex={-1}
          style={{
            maxWidth: 'max-content',
            height: 'auto',
            display: `${displayStyle}`,
          }}
          type="button"
          className={`flex flex-row link-container ${className}`}
        >
          <p className={`link ${linkUnderline}`}>{label}</p>
          {icon && <p className="ml-1">{icon}</p>}
        </button>
      </a>
    );
  }
  if (type == 'button') {
    return (
      <button
        onClick={callback}
        style={{
          maxWidth: 'max-content',
          height: 'auto',
          display: `${displayStyle}`,
        }}
        type="button"
        className={`flex flex-row link-container ${className}`}
      >
        <p className={`link ${linkUnderline}`}>{label}</p>
        {icon && <p className="ml-1">{icon}</p>}
      </button>
    );
  }
  if (type == 'link') {
    return (
      <a
        style={{
          maxWidth: 'max-content',
          height: 'auto',
          display: `${displayStyle}`,
        }}
        tabIndex={linkIndex}
        href={url}
        aria-label={label}
        className={`flex flex-row link-container ${className}`}
      >
        <p className={`link ${linkUnderline}`}>{label}</p>
        {icon && <p className="ml-1">{icon}</p>}
      </a>
    );
  }
};
