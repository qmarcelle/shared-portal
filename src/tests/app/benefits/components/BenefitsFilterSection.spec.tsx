import { Filter } from '@/components/foundation/Filter';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  return render(
    <Filter
      className="large-section px-0 m-0"
      filterHeading="Filter Benefits"
      filterItems={[
        {
          type: 'dropdown',
          label: 'Member',
          value: [
            {
              label: 'Chris Hall',
              value: '1',
              id: '1',
            },
            {
              label: 'Madission Hall',
              value: '2',
              id: '2',
            },
            {
              label: 'Forest Hall',
              value: '3',
              id: '3',
            },
            {
              label: 'Telly Hall',
              value: '4',
              id: '4',
            },
            {
              label: 'Janie Hall',
              value: '5',
              id: '5',
            },
          ],
          selectedValue: { label: 'Chris Hall', value: '1', id: '1' },
        },
        {
          type: 'dropdown',
          label: 'Benefit Type',
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
            {
              label: 'Other',
              value: '6',
              id: '6',
            },
          ],
          selectedValue: { label: 'All Types', value: '1', id: '1' },
        },
      ]}
    />,
  );
};

describe('BenefitsFilterSection', () => {
  it('should render the UI correctly', async () => {
    const { container } = renderUI();

    // Should show selected profile

    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Benefit Type')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(container).toMatchSnapshot();

    // Should show the dropdown when clicked

    // Should show all profiles

    expect(screen.getByText('Member')).toBeVisible();
    expect(screen.getByText('Benefit Type')).toBeVisible();
    expect(screen.getByText('Chris Hall')).toBeVisible();
    expect(container).toMatchSnapshot();
  });
});
