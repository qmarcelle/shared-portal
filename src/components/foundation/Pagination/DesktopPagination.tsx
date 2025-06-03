import leftIcon from '@/../public/assets/left.svg';
import leftInactiveIcon from '@/../public/assets/left_inactive.svg';
import leftHoverIcon from '@/../public/assets/left_white.svg';
import rightIcon from '@/../public/assets/right.svg';
import rightInactiveIcon from '@/../public/assets/right_inactive.svg';
import rightHoverIcon from '@/../public/assets/right_white.svg';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { DOTS } from '@/utils/hooks/pagination_hook';
import Image from 'next/image';
import { PaginationListProps } from './InnerPagination';

interface DesktopPaginationProps extends PaginationListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paginationRange: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPageChange?: (pageIndex: number) => any;
}

export const DesktopPagination = ({
  currentPage,
  lastPage,
  className,
  paginationRange,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: DesktopPaginationProps) => {
  return (
    <ul aria-label="pagination" className={`pagination-container ${className}`}>
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
          <TextBox text="Previous" className="pt-1" />
        </Row>
      </li>
      {paginationRange.map((pageNumber, index) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li key={index} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        // Render our Page Pills
        return (
          <li
            key={index}
            className={`pagination-item${
              pageNumber === currentPage ? ' disabled selected' : ''
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={`pagination-item${
          currentPage === lastPage ? ' disabled' : ''
        }`}
        onClick={onNext}
      >
        <Row className="arrow right">
          <TextBox text="Next" className="pt-1" />
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
