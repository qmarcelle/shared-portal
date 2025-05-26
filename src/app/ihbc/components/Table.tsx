import { ReactNode } from 'react';

type TableProps<T> = {
  className?: string;
  header: ReactNode;
  preItems?: ReactNode;
  items: T[];
  itemBuilder: (item: T, index: number) => ReactNode;
};

export const Table = <T extends object>({
  className,
  header,
  preItems,
  items,
  itemBuilder,
}: TableProps<T>) => {
  return (
    <table className={className}>
      {header}
      {preItems && preItems}
      {items.map((item, index) => itemBuilder(item, index))}
    </table>
  );
};
