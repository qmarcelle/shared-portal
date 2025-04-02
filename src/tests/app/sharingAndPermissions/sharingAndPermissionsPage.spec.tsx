import SharingPermissionsPage from '@/app/sharingPermissions/page';
import { UserRole } from '@/userManagement/models/sessionUser';
import { render } from '@testing-library/react';

const mockAuth = jest.fn();
jest.mock('src/auth', () => ({
  auth: () => mockAuth(),
}));

describe('SharingAndPermissions Page', () => {
  it('should render the page correctly for Member', async () => {
    mockAuth.mockResolvedValue({
      user: {
        currUsr: {
          role: UserRole.MEMBER,
        },
      },
    });

    const Page = await SharingPermissionsPage();
    const { container } = render(Page);

    expect(container).toMatchSnapshot();
  });

  it('should render the page correctly for PR', async () => {
    mockAuth.mockResolvedValue({
      user: {
        currUsr: {
          role: UserRole.PERSONAL_REP,
        },
      },
    });

    const Page = await SharingPermissionsPage();
    const { container } = render(Page);

    expect(container).toMatchSnapshot();
  });
});
