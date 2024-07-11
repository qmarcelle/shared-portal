import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Filter } from '../../../components/foundation/Filter';

const renderUI = () => {
  return render(
    <Filter
      className="large-section px-0 m-0"
      filterHeading="Filter Prior Authorizations"
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
              label: 'Last 30 days',
              value: '1',
              id: '1',
            },
            {
              label: 'Last 60 days',
              value: '2',
              id: '2',
            },
            {
              label: 'Last 90 days',
              value: '3',
              id: '3',
            },
            {
              label: 'Last 120 days',
              value: '4',
              id: '4',
            },
            {
              label: 'Last calender Years',
              value: '5',
              id: '5',
            },
            {
              label: 'Last two Years',
              value: '6',
              id: '6',
            },
          ],
          selectedValue: { label: 'Last two Years', value: '6', id: '6' },
        },
      ]}
    />,
  );
};

describe('PriorAuth FilterSection', () => {
  it('should render the UI correctly', async () => {
    const { container } = renderUI();

    // Should show selected profile

    expect(screen.getByText('Connected Plans')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();

    expect(screen.getByText('Last two Years')).toBeVisible();

    expect(container).toMatchSnapshot();

    // Should show the dropdown when clicked

    // Should show all profiles
    expect(screen.getByText('Connected Plans')).toBeVisible();
    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Date Range')).toBeVisible();

    expect(screen.getByText('Last two Years')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
