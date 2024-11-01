import { ReactNode } from 'react';
import { IComponent } from '../IComponent';

interface PageProps extends IComponent {
  children: ReactNode;
}

export const AppPage = ({
  className = '',
  children,
  onClick,
  tabIndex,
}: PageProps) => {
  return (
    <main
      tabIndex={tabIndex}
      className={`flex flex-col justify-center items-center page ${className}`.trimEnd()}
      onClick={onClick}
    >
      {children}
    </main>
  );
};
