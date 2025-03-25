import { ReactNode } from 'react';
import { IComponent } from '../IComponent';

export interface LinkProps extends IComponent {
  url?: string;
  label: string;
  icon?: ReactNode | null;
  displayStyle?: string;
  linkUnderline?: string;
  callback?: () => void;
}

export const AppLink = ({
  label,
  icon,
  url,
  callback,
  className,
  linkUnderline,
  displayStyle = 'block',
}: LinkProps) => {
  return (
    <a style={{ display: `${displayStyle}` }} href={url} aria-label={label}>
      <button
        onClick={callback}
        style={{
          maxWidth: 'max-content',
          height: 'auto',
          display: `${displayStyle}`,
        }}
        type="button"
        tabIndex={-1}
        className={`flex flex-row link-container ${className}`}
      >
        <p className={`link ${linkUnderline}`}>{label}</p>
        {icon && <p className="ml-1">{icon}</p>}
      </button>
    </a>
  );
};
