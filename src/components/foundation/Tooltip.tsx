import { ReactNode } from 'react';
import { IComponent } from '../IComponent';

interface ToolTipProps extends IComponent {
  showTooltip: boolean;
  label: ReactNode;
  children: JSX.Element;
}

export const ToolTip = ({
  label,
  showTooltip,
  children,
  className,
}: ToolTipProps) => {
  return (
    <div className={`tooltip ${className}`}>
      {showTooltip && <span className="tooltiptext">{label}</span>}
      {children}
    </div>
  );
};
