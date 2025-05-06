import PersonalRepresentativeAccess from '@/app/(protected)/(common)/member/personalRepresentativeAccess';
import PersonalRepresentativePage from '@/app/(protected)/(common)/member/personalRepresentativeAccess/page';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { redirect } from 'next/navigation';

const renderUI = () => {
  return render(<PersonalRepresentativeAccess />);
};
jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          role: UserRole.PERSONAL_REP,
        },
      },
    }),
  ),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

describe('PersonalRepresentativeAccess', () => {
  it('should redirect to /dashboard if user role is PERSONAL_REP', async () => {
    await PersonalRepresentativePage();
    expect(redirect).toHaveBeenCalledWith('/dashboard');
  });

  it('should render PersonalRepresentativeAccess if user role is not PERSONAL_REP', async () => {
    const component = renderUI();
    jest.mock('src/auth', () => ({
      auth: jest.fn(() =>
        Promise.resolve({
          user: {
            currUsr: {
              role: UserRole.MEMBER,
            },
          },
        }),
      ),
    }));

    render(<PersonalRepresentativeAccess />);
    expect(component).toMatchSnapshot();
  });
});
