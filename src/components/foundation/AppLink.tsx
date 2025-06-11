import { ReactNode, forwardRef } from 'react';
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
  target?: string;
  callback?: () => void;
}

export const AppLink = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
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
    },
    ref,
  ) => {
    // Defect 76162: Enhanced styling for proper link clickability and accessibility
    const baseLinkClasses =
      'cursor-pointer hover:text-primary-600 focus:ring-2 focus:ring-primary-500 focus:outline-none active:text-primary-800 transition-colors duration-200';

    if (type === 'default') {
      return (
        <a
          style={{ display: `${displayStyle}`, cursor: 'pointer' }}
          href={url}
          aria-label={label}
          role="link"
          target={target}
          ref={ref}
          className={baseLinkClasses}
          onClick={(e) => {
            if (callback) {
              e.preventDefault();
              callback();
            }
          }}
        >
          <button
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
            cursor: 'pointer',
          }}
          type="button"
          className={`flex flex-row link-container ${className} ${baseLinkClasses}`}
          aria-label={label}
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
            maxWidth: 'max-content',
            height: 'auto',
            display: `${displayStyle}`,
            cursor: 'pointer',
          }}
          tabIndex={linkIndex}
          href={url}
          aria-label={label}
          role="link"
          target={target}
          className={`flex flex-row link-container ${className} ${baseLinkClasses}`}
          ref={ref}
          onClick={(e) => {
            if (callback) {
              e.preventDefault();
              callback();
            }
          }}
        >
          <p className={`link ${linkUnderline}`}>{label}</p>
          {icon && <p className="ml-1">{icon}</p>}
        </a>
      );
    }

    //  return null;
  },
);

AppLink.displayName = 'AppLink';
