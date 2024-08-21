import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { PriorAuthorizationCardSection } from '../../../app/priorAuthorization/components/PriorAuthorizationCardSection';

const renderUI = () => {
  return render(
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
          claimInfo: {},
          columns: [
            { label: 'Referred by', value: 'Anand Patel', defaultValue: 'N/A' },
            { label: 'Referred to', value: 'Anand Patel', defaultValue: 'N/A' },
          ],
        },
      ]}
    />,
  );
};

describe('PriorAuthorizationCardSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render UI correctly', () => {
    const component = renderUI();
    screen.getByText('Sort by:');
    screen.getAllByText('Date (Most Recent)');

    screen.getByText('Physical Therapy');
    screen.getByText('Visited on 04/06/23');
    screen.getAllByText('For Chris Hall');
    screen.getAllByText('Pending');
    screen.getByText('Referred by');
    screen.getByText('Referred to');
    screen.getAllByAltText(/medical/i);

    expect(component.baseElement).toMatchSnapshot();
  });
});
