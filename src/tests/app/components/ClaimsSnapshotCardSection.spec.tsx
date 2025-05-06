import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ClaimsSnapshotCardSection } from '../../../a../((common)/claims/components/ClaimsSnapshotCardSection';

const renderUI = () => {
  return render(
    <ClaimsSnapshotCardSection
      sortby={[
        {
          label: 'Date (Most Recent)',
          value: '43',
        },
        {
          label: 'MyShare (Low to High)',
          value: '0',
        },
        {
          label: 'Status (Denied First)',
          value: '2',
        },
        {
          label: 'MyShare (High to Low)',
          value: '4',
        },
      ]}
      onSelectedDateChange={() => {}}
      selectedDate="43"
      claims={[
        {
          id: 'Claim1',
          claimStatus: 'Pending',
          claimType: 'Medical',
          claimTotal: null,
          issuer: 'John Hopkins',
          memberName: 'Chris Hall',
          serviceDate: '08/23/23',
          claimInfo: {},
          columns: [
            {
              label: 'Total Billed',
              value: '$535.00',
              defaultValue: '--',
            },
            {
              label: 'Plan Paid',
              value: null,
              defaultValue: '--',
            },
            {
              label: 'My Share',
              value: null,
              defaultValue: '--',
              isValueBold: true,
              isVisibleInMobile: true,
            },
          ],
        },
      ]}
    />,
  );
};

describe('ClaimsSnapshotCardSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByText('Sort by:');
    screen.getAllByText('Date (Most Recent)');
    screen.getByText('John Hopkins');
    screen.getByText('Visited on 08/23/23');
    screen.getAllByText('For Chris Hall');
    screen.getAllByText('Pending');
    screen.getByText('Total Billed');
    screen.getByText('Plan Paid');
    screen.getByText('My Share');
    screen.getByText('$535.00');
    screen.getAllByAltText(/medical/i);
    expect(component.baseElement).toMatchSnapshot();
  });
});
