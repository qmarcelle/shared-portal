import PriorAuthorization from '@/app/priorAuthorization/page';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <>
      <PriorAuthorization />,
      {/* <Filter
        className="large-section px-0 m-0"
        filterHeading="Filter Prior Authorizations"
        filterItems={[
          {
            type: 'dropdown',
            label: 'Member',
            value: [
              { label: 'All Members', value: '1', id: '1' },
              { label: 'Chris Hall', value: '2', id: '2' },
              { label: 'Madission Hall', value: '3', id: '3' },
              { label: 'Forest Hall', value: '4', id: '4' },
              { label: 'Telly Hall', value: '5', id: '5' },
              { label: 'Janie Hall', value: '6', id: '6' },
            ],
            selectedValue: { label: 'All Members', value: '1', id: '1' },
          },
          {
            type: 'dropdown',
            label: 'Date Range',
            value: [
              { label: 'Last 30 days', value: '1', id: '1' },
              { label: 'Last 60 days', value: '2', id: '2' },
              { label: 'Last 90 days', value: '3', id: '3' },
              { label: 'Last 120 days', value: '4', id: '4' },
              { label: 'Last calender Years', value: '5', id: '5' },
              { label: 'Last two Years', value: '6', id: '6' },
            ],
            selectedValue: { label: 'Last two Years', value: '6', id: '6' },
          },
        ]}
      />
      , */}
    </>,
  );
};

describe('PriorAuth FilterSection', () => {
  it('should render the UI correctly', async () => {
    const { container } = renderUI();
    expect(screen.getByText('Prior Authorization')).toBeVisible();
    screen.getAllByText(
      'If you need more than two years of prior authorizations, call [1-800-000-000]. If your authorization is not fully approved, we will send you a letter explaining why and details on how to ask for an appeal.',
    );
    // Check if elements are visible
    expect(screen.getByText('Filter Prior Authorizations')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('All Members')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();
    expect(screen.getByText('Last two Years')).toBeVisible();
    const dateRangeDropdown = screen.getByText('Last two Years');

    // changing the value of the dropdown
    fireEvent.click(dateRangeDropdown);

    // Assert that "Last 90 days" is now the selected value
    const selectedOption = screen.getByText('Last 90 days');
    fireEvent.click(selectedOption);
    expect(screen.getByText('Last 90 days')).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
