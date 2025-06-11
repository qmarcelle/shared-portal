import { IComponent } from '@/components/IComponent';
import { TextBox } from '@/components/foundation/TextBox';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { InnerPagination } from './InnerPagination';

interface PaginationProps<T> extends IComponent {
  initialList: T[];
  pageSize: number;
  totalCount?: number;
  className?: string;
  label?: string;
  itemsBuilder: (data: T, index: number) => ReactNode;
  wrapperBuilder: (itemsBuilder: ReactNode) => ReactNode;
}

export const Pagination = <T,>({
  initialList,
  pageSize,
  totalCount,
  label,
  wrapperBuilder,
  itemsBuilder,
}: PaginationProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageItems, setPageItems] = useState(new Map<number, T[]>());

  const mapItemList = useCallback(() => {
    const items: Map<number, T[]> = new Map<number, T[]>();
    const totalPageCount = Math.ceil(
      (totalCount ?? initialList.length) / pageSize,
    );
    for (let i = 0; i < totalPageCount; i++) {
      const firstItemIndex = i * pageSize;
      const lastItemIndex = firstItemIndex + pageSize;
      items.set(i + 1, initialList.slice(firstItemIndex, lastItemIndex));
    }
    setPageItems(items);
  }, [initialList, pageSize, totalCount]);

  useEffect(() => {
    mapItemList();
  }, [initialList, mapItemList]);

  const itemList = (pageItems.get(currentPage) ?? []).map((item, index) => {
    return itemsBuilder(item, index);
  });

  if (initialList.length == 0) {
    return (
      <section className="flex justify-center self-center pt-5">
        <TextBox className="m-2 mt-0" text={`No ${label} found`}></TextBox>
      </section>
    );
  }

  // [Defect 73528] Only show pagination when there are more items than the page size
  // This fixes the issue where pagination was showing even with ≤5 results
  // Pagination should only appear when the total items exceed the page size
  const shouldShowPagination = (totalCount ?? initialList.length) > pageSize;

  return (
    <>
      {wrapperBuilder(itemList)}
      {shouldShowPagination && (
        <>
          {label && pageItems.get(currentPage) ? (
            <section className="flex justify-center self-center pt-5">
              <TextBox
                className="m-2 mt-0"
                text={`Viewing ${currentPage > 1 ? (currentPage - 1) * pageSize + (pageItems.get(currentPage)?.length ?? 0) : pageItems.get(currentPage)?.length} of ${totalCount ?? initialList.length} ${label}`}
              ></TextBox>
            </section>
          ) : null}
          <InnerPagination
            className="pagination"
            currentPage={currentPage}
            totalCount={totalCount ?? initialList.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      )}
    </>
  );
};
