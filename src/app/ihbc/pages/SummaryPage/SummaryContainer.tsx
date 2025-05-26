import { Button } from '@/components/foundation/Button';
import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { ReactNode } from 'react';
import { NavPagesEnum } from '../../models/NavPagesEnum';
import { useNavigationStore } from '../../stores/navigationStore';

type Props = {
  title: string;
  children: ReactNode;
  className?: string;
  navPage: NavPagesEnum;
};

export const SummaryContainer = ({
  title,
  children,
  className,
  navPage,
}: Props) => {
  const [allowedPages, dropTo] = useNavigationStore((state) => [
    state.allowedPages,
    state.dropTo,
  ]);
  return (
    <Column className={`border border-black p-2 ${className && className}`}>
      <TextBox type="title-3" className="text-orange-400" text={title} />
      {children}
      {allowedPages.includes(navPage) && (
        <Button
          className="w-fit"
          label="Edit"
          callback={() => dropTo(navPage)}
        />
      )}
    </Column>
  );
};
