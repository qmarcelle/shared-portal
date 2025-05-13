import { ClaimStatus } from '@/app/authDetail/models/claim-status';
import { PriorAuthDetailsSection } from '@/app/priorAuthorization/authDetails/component/PriorAuthDetailSection';
import { ClaimType } from '@/app/priorAuthorization/models/claim-type';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <PriorAuthDetailsSection
      className="large-section"
      priorauthDetails={[
        {
          priorAuthDetailType: ClaimType.Medical,
          dateOfVisit: '12/06/2022',
          priorAuthDetailStatus: ClaimStatus.PartialApproval,
          member: 'Chris Hall',
          PriorAuthReferenceId: 'ABC123456789',
          authInfo: [],
          priorAuthDetailName:
            'Continuous Positive Airway Pressure Machine (CPAP)',
          referredName: 'Anand Patel',
        },
      ]}
    />,
  );
};

describe('PriorAuthDetailsSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByRole('heading', {
      name: 'Continuous Positive Airway Pressure Machine (CPAP)',
    });
    screen.getByText('PartialApproval');
    screen.getByText('Visited on 12/06/2022');
    screen.getByText('For Chris Hall');
    screen.getByText('Reference ID : ABC123456789');

    expect(component).toMatchSnapshot();
  });
});
