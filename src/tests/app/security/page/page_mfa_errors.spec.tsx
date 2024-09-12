import { LoginStore, useLoginStore } from '@/app/login/stores/loginStore';
import { SecuritySettings } from '@/app/security/components/SecuritySettingsComponent';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { mockedAxios } from '../../../__mocks__/axios';

//jest.setTimeout(30000);
const setupUI = () => {
  return render(<SecuritySettings username="Testuser" />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));

describe('Security Page', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should render page correctly when errors occur', async () => {
    // Api sends Text, Voice, Email as Active
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );

    const { container } = setupUI();

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/getDevices',
        { userId: 'xxxx' },
      );
    });

    // Mfa Device should not be present
    expect(screen.queryByRole('list')).toBeNull();

    //Toggle Button should be present
    expect(screen.queryByLabelText('toggle mfa')).toBeNull();
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        "We're not able to load your MFA settings right now. Please try again later.",
      ),
    ).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
