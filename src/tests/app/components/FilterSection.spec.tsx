import { Filter } from '@/components/foundation/Filter';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <Filter
      className="large-section px-0 m-0"
      filterHeading="Filter Claims"
      dropDown={[
        {
          dropNownName: 'Connected Plans',
          dropDownval: [
            {
              label: 'All Plans',
              value: '1',
              id: '1',
            },
            {
              label: 'Plans',
              value: '2',
              id: '2',
            },
          ],
          selectedValue: { label: 'All Plans', value: '1', id: '1' },
        },
        {
          dropNownName: 'Member',
          dropDownval: [
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
          dropNownName: 'Date Range',
          dropDownval: [
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
          dropNownName: 'Claim Type',
          dropDownval: [
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

describe('FilterSection', () => {
  it('should render the UI correctly', async () => {
    const { container } = renderUI();

    // Should show selected profile

    expect(screen.getByText('Connected Plans')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Claim Type')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();

    expect(screen.getByText('All Plans')).toBeVisible();

    expect(container).toMatchSnapshot();

    // Should show the dropdown when clicked

    // Should show all profiles
    expect(screen.getByText('Connected Plans')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Claim Type')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();
    expect(screen.getByText('All Plans')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
