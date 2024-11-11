import { ReactNode } from 'react';
import { IComponent } from '../IComponent';
import { Column } from './Column';

interface PageProps extends IComponent {
  children: ReactNode;
}

export const Body = ({
  className = '',
  children,
  onClick,
  tabIndex,
}: PageProps) => {
  return (
    <Column
      tabIndex={tabIndex}
      className={`app-content app-base-font-color ${className}`.trimEnd()}
      onClick={onClick}
    >
      {children}
    </Column>
  );
};
