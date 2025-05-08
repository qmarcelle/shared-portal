import { IComponent } from '../IComponent';

interface CardProps extends IComponent {
  backgroundColor?: string;
  type?: 'main' | 'highlight' | 'neutral' | 'elevated' | 'info' | 'button';
  children: JSX.Element;
  onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
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
  onKeyDown,
  role,
  'aria-label': ariaLabel,
}: CardProps) => {
  return (
    <div
      className={`card-${type} ${className}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{ ...(backgroundColor && { backgroundColor: backgroundColor }) }}
      {...(tabIndex !== undefined ? { tabIndex } : {})}
      {...(role ? { role } : {})}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {children}
    </div>
  );
};
