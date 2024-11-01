import { ReactNode } from 'react';
import { IComponent } from '../IComponent';

interface SectionProps extends IComponent {
  children: ReactNode;
}

export const Section = ({
  className = '',
  children,
  onClick,
  tabIndex,
}: SectionProps) => {
  return (
    <div
      tabIndex={tabIndex}
      className={`flex flex-row items-start app-body ${className}`.trimEnd()}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
