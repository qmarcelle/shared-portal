import { IComponent } from '../IComponent';

interface CardProps extends IComponent {
  backgroundColor?: string;
  type?: 'main' | 'highlight' | 'neutral' | 'elevated' | 'info' | 'button';
  children: JSX.Element;
  role?: string;
  'aria-label'?: string;
}

export const Card = ({
  backgroundColor,
  children,
  type = 'main',
  className,
  onClick,
  tabIndex,
  role,
  'aria-label': ariaLabel,
}: CardProps) => {
  return (
    <div
      className={`card-${type} ${className}`}
      onClick={onClick}
      style={{ ...(backgroundColor && { backgroundColor: backgroundColor }) }}
      {...(tabIndex !== undefined ? { tabIndex } : {})}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </div>
  );
};
