import { OnMyPlanComponent } from '@/components/composite/OnMyPlanComponent';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <OnMyPlanComponent
      infoIcon={true}
      onMyPlanDetails={[
        {
          memberName: 'Chris Hall',
          DOB: '01/01/1978',
          sharingType: 'Medical / Dental / Vision',
          isMinor: false,
        },
        {
          memberName: 'Forest Hall',
          DOB: '01/01/2001',
          sharingType: 'Medical',
          isMinor: false,
        },
        {
          memberName: 'Corey Hall',
          DOB: '01/01/2002',
          sharingType: 'Medical',
          isMinor: false,
        },
        {
          memberName: 'Telly Hall',
          DOB: '01/01/2008',
          sharingType: 'Medical',
          isMinor: false,
        },
      ]}
    />,
  );
};

describe('OnMyPlanComponent', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    screen.getByText('Chris Hall');
    screen.getByText('DOB: 01/01/1978');
    screen.getByText('Medical / Dental / Vision');

    expect(component).toMatchSnapshot();
  });
});
