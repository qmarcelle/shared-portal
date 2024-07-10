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
  className = 'tooltip',
}: ToolTipProps) => {
  return (
    <div className={className}>
      {showTooltip && <span className="tooltiptext">{label}</span>}
      {children}
    </div>
  );
};
