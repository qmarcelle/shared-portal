import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { PriorAuthorizationCardSection } from '../../../app/(main)/priorAuthorization/components/PriorAuthorizationCardSection';

const renderUI = (width: number = 1000) => {
  return render(
    <ResponsiveContext.Provider value={{ width }}>
      <PriorAuthorizationCardSection
        sortby={[
          {
            label: 'Date (Most Recent)',
            value: '43',
          },
          {
            label: 'Status (Denied First)',
            value: '2',
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
            issuer: 'Physical Therapy',
            memberName: 'Chris Hall',
            serviceDate: '04/06/23',
            totalBilled: '',
            claimsFlag: false,
            claimInfo: {},
            ReferredBy: 'Anand Patel',
            ReferredTo: 'Anand Patel',
            priorAuthFlag: true,
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

    screen.getByText('Physical Therapy');
    screen.getByText('Visited on 04/06/23');
    screen.getByText('For Chris Hall');
    screen.getByText('Pending');
    screen.getByText('Referred by');
    screen.getByText('Referred to');
    screen.getByAltText(/medical/i);

    expect(component.baseElement).toMatchSnapshot();
  });

  it('should render UI correctly for mobile device', () => {
    const component = renderUI(700);

    screen.getByText('Sort by:');
    screen.getAllByText('Date (Most Recent)');

    screen.getByText('Physical Therapy');
    screen.getByText('For Chris Hall');
    screen.getByText('Pending');
    screen.getByAltText(/medical/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
