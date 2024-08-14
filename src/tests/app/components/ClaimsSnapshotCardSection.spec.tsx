import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { ClaimsSnapshotCardSection } from '../../../app/claimSnapshotList/components/ClaimsSnapshotCardSection';

const renderUI = (width: number = 1000) => {
  return render(
    <ResponsiveContext.Provider value={{ width }}>
      <ClaimsSnapshotCardSection
        sortby={[
          {
            label: 'MyShare (Low to High)',
            value: '0',
          },
          {
            label: 'Date (Most Recent)',
            value: '43',
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
            totalBilled: '535.00',
            claimsFlag: true,
            claimInfo: {},
          },
        ]}
      />
    </ResponsiveContext.Provider>,
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
    screen.getByText('For Chris Hall');
    screen.getByText('Pending');
    screen.getByText('Total Billed');
    screen.getByText('Plan Paid');
    screen.getByText('My Share');
    screen.getByText('$535.00');
    screen.getByAltText(/medical/i);
    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for mobile device', () => {
    const component = renderUI(700);
    screen.getByText('Sort by:');
    screen.getAllByText('Date (Most Recent)');
    screen.getByText('John Hopkins');
    screen.getByText('For Chris Hall');
    screen.getByText('Pending');
    screen.getByText('My Share');
    screen.getByAltText(/medical/i);
    expect(component.baseElement).toMatchSnapshot();
  });
});
