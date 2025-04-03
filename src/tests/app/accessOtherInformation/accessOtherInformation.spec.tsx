import AccessOthersInformation from '@/app/accessOthersInformation';
import AccessOthersInformationPage from '@/app/accessOthersInformation/page';
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
  return render(<AccessOthersInformation />);
};

describe('Communication accessOtherInformation', () => {
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
    await AccessOthersInformationPage();
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should render accessOtherInformation if user role is not PERSONAL_REP', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValue({
      user: {
        currUsr: {
          role: UserRole.MEMBER,
        },
      },
    });

    const component = renderUI();
    await waitFor(() => {
      expect(redirect).not.toHaveBeenCalled();
      expect(component).toMatchSnapshot();
    });
  });
});
