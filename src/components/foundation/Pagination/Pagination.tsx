import { IComponent } from '@/components/IComponent';
import { TextBox } from '@/components/foundation/TextBox';
import { ReactNode, useEffect, useState } from 'react';
import { InnerPagination } from './InnerPagination';

interface PaginationProps<T> extends IComponent {
  initialList: T[];
  pageSize: number;
  totalCount?: number;
  className: string;
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

  useEffect(() => {
    mapItemList();
  });

  const mapItemList = () => {
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
  };

  const itemList = (pageItems.get(currentPage) ?? []).map((item, index) => {
    return itemsBuilder(item, index);
  });

  return (
    <>
      {wrapperBuilder(itemList)}
      {label ? (
        <section className="flex justify-center self-center pt-5">
          <TextBox
            className="m-2 mt-0"
            text={`Viewing ${currentPage} of ${totalCount} ${label}`}
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
  );
};
