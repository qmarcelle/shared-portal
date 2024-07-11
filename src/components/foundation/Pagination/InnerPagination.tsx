import {
  UsePaginationProps,
  usePagination,
} from '@/utils/hooks/pagination_hook';
import { DesktopPagination } from './DesktopPagination';
import { MobilePagination } from './MobilePagination';

interface InnerPaginationProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageChange: (val: any) => void;
  className: string;
}

export interface PaginationListProps {
  currentPage: number;
  lastPage: string | number;
  className: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPrevious?: () => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext?: () => any;
}

export const InnerPagination = ({
  onPageChange,
  totalCount,
  siblingCount = 1,
  currentPage,
  pageSize,
  className,
}: InnerPaginationProps & UsePaginationProps) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });
  if (currentPage === 0 || !Array.isArray(paginationRange)) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const onSelectedPageChange = (selectedPage: string) => {
    onPageChange(Number(selectedPage));
  };

  const lastPage = paginationRange[paginationRange.length - 1];
  return (
    <section>
      <DesktopPagination
        currentPage={currentPage}
        lastPage={lastPage}
        className={className}
        onPrevious={onPrevious}
        onNext={onNext}
        onPageChange={onPageChange}
        paginationRange={paginationRange}
      />
      <MobilePagination
        currentPage={currentPage}
        lastPage={lastPage}
        totalPageCount={Math.ceil(totalCount / pageSize)}
        className={className}
        onPrevious={onPrevious}
        onNext={onNext}
        onSelectedPageChange={onSelectedPageChange}
      />
    </section>
  );
};
