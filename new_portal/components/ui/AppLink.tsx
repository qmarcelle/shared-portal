import { ReactNode } from 'react';

type ButtonType = 'default' | 'link' | 'button';

export interface LinkProps {
  url?: string;
  label: string;
  type?: ButtonType;
  linkIndex?: number;
  icon?: ReactNode | null;
  displayStyle?: string;
  linkUnderline?: string;
  target?: string;
  callback?: () => void;
  className?: string;
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
  target,
}: LinkProps) => {
  if (type == 'default') {
    return (
      <a
        style={{ display: `${displayStyle}` }}
        href={url}
        aria-label={label}
        target={target}
      >
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
        <p
          className={`link ${linkUnderline}`}
          style={{ display: `${displayStyle}` }}
        >
          {label}
        </p>
        {icon && (
          <p className="ml-1" style={{ display: `${displayStyle}` }}>
            {icon}
          </p>
        )}
      </button>
    );
  }
  if (type == 'link') {
    return (
      <a
        style={{
          maxWidth: 'max-width',
          height: 'auto',
          display: `${displayStyle}`,
        }}
        tabIndex={linkIndex}
        href={url}
        aria-label={label}
        target={target}
        className={`flex flex-row link-container ${className}`}
      >
        <p className={`link ${linkUnderline}`}>{label}</p>
        {icon && <p className="ml-1">{icon}</p>}
      </a>
    );
  }
  
  // Default fallback
  return null;
};