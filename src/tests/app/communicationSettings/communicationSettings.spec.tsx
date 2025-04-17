import CommunicationSettings from '@/app/communicationSettings';
import CommunicationSettingsPage from '@/app/communicationSettings/page';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render, waitFor } from '@testing-library/react';
import { redirect } from 'next/navigation';

// Mock the redirect function
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

// Mock the auth function
jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

const renderUI = () => {
  return render(
    <CommunicationSettings
      data={{
        emailAddress: '',
        mobileNumber: '',
        visibilityRules: undefined,
        tierOne: undefined,
        tierOneDescriptions: [],
        dutyToWarn: undefined,
        phoneNumber: '',
      }}
    />,
  );
};

describe('Communication Settings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should redirect to /dashboard if user role is PERSONAL_REP', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue({
      user: {
        currUsr: {
          role: UserRole.PERSONAL_REP,
        },
      },
    });

    await CommunicationSettingsPage();
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should render communicationSettings if user role is not PERSONAL_REP', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue({
      user: {
        currUsr: {
          role: UserRole.MEMBER,
        },
      },
    });

    const component = renderUI();
    //await CommunicationSettingsPage();
    await waitFor(() => {
      expect(redirect).not.toHaveBeenCalled();
      expect(component).toMatchSnapshot();
    });
  });
});
