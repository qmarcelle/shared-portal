import { Filter } from '@/components/foundation/Filter';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <Filter
      className="large-section px-0 m-0"
      filterHeading="Filter Summary"
      filterItems={[
        {
          type: 'dropdown',
          label: 'Member',
          value: [
            {
              label: 'All Members',
              value: '1',
              id: '1',
            },
            {
              label: 'Chris Hall',
              value: '2',
              id: '2',
            },
            {
              label: 'Madission Hall',
              value: '3',
              id: '3',
            },
            {
              label: 'Forest Hall',
              value: '4',
              id: '4',
            },
            {
              label: 'Telly Hall',
              value: '5',
              id: '5',
            },
            {
              label: 'Janie Hall',
              value: '6',
              id: '6',
            },
          ],
          selectedValue: { label: 'All Members', value: '1', id: '1' },
        },
        {
          type: 'dropdown',
          label: 'Date Range',
          value: [
            {
              label: '2023',
              value: '1',
              id: '1',
            },
            {
              label: '2022',
              value: '2',
              id: '2',
            },
            {
              label: '2021',
              value: '3',
              id: '3',
            },
          ],
          selectedValue: { label: '2023', value: '1', id: '1' },
        },
        {
          type: 'dropdown',
          label: 'Claim Type',
          value: [
            {
              label: 'All Types',
              value: '1',
              id: '1',
            },
            {
              label: 'Medical',
              value: '2',
              id: '2',
            },
            {
              label: 'Pharmacy',
              value: '3',
              id: '3',
            },
            {
              label: 'Dental',
              value: '4',
              id: '4',
            },
            {
              label: 'Vision',
              value: '5',
              id: '5',
            },
          ],
          selectedValue: { label: 'All Types', value: '1', id: '1' },
        },
      ]}
    />,
  );
};

describe('Spending Summary FilterSection', () => {
  it('should render the UI correctly', async () => {
    const { container } = renderUI();

    // Should show selected profile

    expect(screen.getByText('Date Range')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Claim Type')).toBeVisible();

    expect(screen.getByText('2023')).toBeVisible();

    expect(container).toMatchSnapshot();

    // Should show the dropdown when clicked

    // Should show all profiles
    expect(screen.getByText('Date Range')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Claim Type')).toBeVisible();

    expect(screen.getByText('2023')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
