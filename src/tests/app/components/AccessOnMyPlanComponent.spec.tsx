import { AccessOnMyPlanComponent } from '@/app/(main)/accessOthersInformation/components/AccessOnMyPlanComponent';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

const renderUI = () => {
  render(
    <AccessOnMyPlanComponent
      infoIcon={false}
      accessOnMyPlanDetails={[
        {
          memberName: 'Maddison Hall',
          DOB: '01/01/1979',
          isOnline: true,
        },
        {
          memberName: 'Forest Hall',
          DOB: '01/01/2001',
          isOnline: true,
        },
        {
          memberName: 'Corey Hall',
          DOB: '01/01/2002',
          isOnline: false,
        },
        {
          memberName: 'Telly Hall',
          DOB: '01/01/2008',
          isOnline: true,
        },
        {
          memberName: 'Janie Hall',
          DOB: '01/01/2024',
          isOnline: true,
        },
      ]}
    />,
  );
};

describe('AccessOnMyPlanComponent', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(screen.getByText('Maddison Hall')).toBeInTheDocument();
    expect(screen.getByText('DOB: 01/01/1979')).toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
});
