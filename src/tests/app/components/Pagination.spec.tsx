import { InnerPagination } from '@/components/foundation/Pagination/InnerPagination';
import { Pagination } from '@/components/foundation/Pagination/Pagination';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const mockPageChange = jest.fn(() => {});
const renderUI = (
  currentPage: number,
  totalCount: number,
  pageSize: number,
) => {
  return render(
    // shouuld this be in an inner pagination test? Should we separate out innerpagination from pagination? 
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

describe('Pagination display count', () => {
  it('should display correct count on multiple pages', () => {
    // Create mock data with 15 items
    const mockItems = Array.from({ length: 15 }, (_, i) => ({ id: i+1 }));
    
    render(
      <Pagination
        initialList={mockItems}
        pageSize={10}
        label="Items"
        itemsBuilder={(item) => <div key={item.id}>Item {item.id}</div>}
        wrapperBuilder={(items) => <div data-testid="items-wrapper">{items}</div>}
      />
    );
    
    // First page should say "Viewing 10 of 15 Items"
    expect(screen.getByText('Viewing 10 of 15 Items')).toBeInTheDocument();
    
    // Check that first page has 10 items
    const firstPageItems = screen.getAllByText(/Item \d+/);
    expect(firstPageItems.length).toBe(10);
    
    // Navigate to second page
    fireEvent.click(screen.getByText('Next'));
    
    // Second page should display "Viewing 15 of 15 Items"
    expect(screen.getByText('Viewing 15 of 15 Items')).toBeInTheDocument();
    
    // Check that second page has 5 items
    const secondPageItems = screen.getAllByText(/Item \d+/);
    expect(secondPageItems.length).toBe(5);
  });
});