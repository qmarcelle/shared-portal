import leftIcon from '@/../public/assets/left.svg';
import leftInactiveIcon from '@/../public/assets/left_inactive.svg';
import leftHoverIcon from '@/../public/assets/left_white.svg';
import rightIcon from '@/../public/assets/right.svg';
import rightInactiveIcon from '@/../public/assets/right_inactive.svg';
import rightHoverIcon from '@/../public/assets/right_white.svg';
import { Dropdown, SelectItem } from '@/components/foundation/Dropdown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { PaginationListProps } from './InnerPagination';

interface MobilePaginationProps extends PaginationListProps {
  totalPageCount: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedPageChange?: (pageIndex: string) => any;
}

export const MobilePagination = ({
  currentPage,
  lastPage,
  className,
  totalPageCount,
  onSelectedPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: MobilePaginationProps) => {
  const pages: SelectItem[] = [];
  for (let i = 0; i < totalPageCount; i++) {
    const value = (i + 1).toString();
    const page: SelectItem = {
      label: value,
      value,
    };
    pages.push(page);
  }

  return (
    <ul
      aria-label="pagination"
      className={`pagination-mobile-container ${className}`}
    >
      <li
        className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={onPrevious}
      >
        <Row className="arrow left">
          {currentPage === 1 ? (
            <Image src={leftInactiveIcon} alt="" />
          ) : (
            <>
              <Image className="left-icon" src={leftIcon} alt="" />
              <Image className="left-icon-white" src={leftHoverIcon} alt="" />
            </>
          )}
        </Row>
      </li>
      <Row>
        <Spacer axis="horizontal" size={8} />
        <TextBox className="body-1" text="Page: " />
        <Spacer axis="horizontal" size={8} />
        <Dropdown
          key="page"
          onSelectCallback={onSelectedPageChange}
          initialSelectedValue={currentPage.toString()}
          items={pages}
        />
        <Spacer axis="horizontal" size={4} />
        <TextBox className="body-1" text={`of ${totalPageCount}`} />
      </Row>
      <li
        className={`pagination-item${
          currentPage === lastPage ? ' disabled' : ''
        }`}
        onClick={onNext}
      >
        <Row className="arrow right">
          {currentPage === lastPage ? (
            <Image src={rightInactiveIcon} alt="" />
          ) : (
            <>
              <Image className="right-icon" src={rightIcon} alt="" />
              <Image className="right-icon-white" src={rightHoverIcon} alt="" />
            </>
          )}
        </Row>
      </li>
    </ul>
  );
};
