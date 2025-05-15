import { AccessOnMyPlanComponent } from '@/app/accessOthersInformation/components/AccessOnMyPlanComponent';
import { AccessStatus } from '@/models/app/getSharePlanDetails';

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
          requesteeFHRID: '',
          requesteeUMPID: '',
          memberCk: '',
          accessStatus: AccessStatus.FullAccess,
          accessStatusIsPending: false,
          isMinor: false,
          isMatureMinor: false,
          roleType: '',
        },
        {
          memberName: 'Forest Hall',
          DOB: '01/01/2001',
          isOnline: true,
          requesteeFHRID: '',
          requesteeUMPID: '',
          memberCk: '',
          accessStatus: AccessStatus.FullAccess,
          accessStatusIsPending: false,
          isMinor: false,
          isMatureMinor: false,
          roleType: '',
        },
        {
          memberName: 'Corey Hall',
          DOB: '01/01/2002',
          isOnline: false,
          requesteeFHRID: '',
          requesteeUMPID: '',
          memberCk: '',
          accessStatus: AccessStatus.FullAccess,
          accessStatusIsPending: false,
          isMinor: false,
          isMatureMinor: false,
          roleType: '',
        },
        {
          memberName: 'Telly Hall',
          DOB: '01/01/2008',
          isOnline: true,
          requesteeFHRID: '',
          requesteeUMPID: '',
          memberCk: '',
          accessStatus: AccessStatus.FullAccess,
          accessStatusIsPending: false,
          isMinor: false,
          isMatureMinor: false,
          roleType: '',
        },
        {
          memberName: 'Janie Hall',
          DOB: '01/01/2024',
          isOnline: true,
          requesteeFHRID: '',
          requesteeUMPID: '',
          memberCk: '',
          accessStatus: AccessStatus.FullAccess,
          accessStatusIsPending: false,
          isMinor: false,
          isMatureMinor: false,
          roleType: '',
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
