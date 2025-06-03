import { MouseEvent, ReactNode } from 'react';

type Props = {
  disabled: boolean;
  children: ReactNode;
};

export const WithDisabled = ({ disabled = true, children }: Props) => {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  if (disabled) {
    return (
      <div onClick={handleClick} className="opacity-50">
        {children}
      </div>
    );
  }

  return children;
};
