import { InnerPagination } from '@/components/foundation/Pagination/InnerPagination';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const mockPageChange = jest.fn(() => {});
const renderUI = (
  currentPage: number,
  totalCount: number,
  pageSize: number,
) => {
  return render(
    <InnerPagination
      className="pagination-bar"
      currentPage={currentPage}
      totalCount={totalCount}
      pageSize={pageSize}
      onPageChange={mockPageChange}
    />,
  );
};

describe('Pagination', () => {
  it('should render UI correctly with single Pagination', () => {
    const component = renderUI(1, 10, 10);
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render pagination with dots in both sides', () => {
    renderUI(5, 10, 1);
    expect(screen.getAllByText(/…/i).length).toBe(2);
    fireEvent.click(screen.getByText('Next'));
    expect(mockPageChange).toHaveBeenCalledWith(6);
  });

  it('should render pagination with dots in right sides', () => {
    renderUI(1, 10, 1);
    expect(screen.getAllByText(/…/i).length).toBe(1);
    fireEvent.click(screen.getByText('2', { selector: 'li' }));
    expect(mockPageChange).toHaveBeenCalledWith(2);
  });

  it('should render pagination with dots in left sides', () => {
    renderUI(9, 10, 1);
    expect(screen.getAllByText(/…/i).length).toBe(1);
    fireEvent.click(screen.getByText('Previous'));
    expect(mockPageChange).toHaveBeenCalledWith(8);
  });

  it('should render pagination and invoke onPageChange in mobile', () => {
    renderUI(1, 10, 1);
    expect(screen.getAllByText(/…/i).length).toBe(1);
    fireEvent.click(screen.getByText('2', { selector: 'p' }));
    expect(mockPageChange).toHaveBeenCalledWith(2);
  });
});
