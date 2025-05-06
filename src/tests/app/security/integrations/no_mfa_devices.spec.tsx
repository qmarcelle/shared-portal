import { LoginStore, useLoginStore } from '@/app/(protected)/(common)/member/login/stores/loginStore';
import { SecuritySettings } from '@/app/(protected)/(common)/member/security/components/SecuritySettingsComponent';
import { GetMfaDevices } from '@/app/(protected)/(common)/member/security/models/get_mfa_devices';
import { ESResponse } from '@/models/enterprise/esResponse';
import '@testing-library/jest-dom';
import { render, screen, waitFor, within } from '@testing-library/react';
import { mockedAxios } from '../../../__mocks__/axios';

//jest.setTimeout(30000);
const setupUI = () => {
  return render(<SecuritySettings username="Testuser" />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));

describe('No MFA Devices', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should render the disabled devices if no devices are configured and mfa is enabled', async () => {
    // Api sends Text, Voice, Email as Active
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          mfaEnabled: 'true',
        },
      } satisfies ESResponse<GetMfaDevices>,
    });

    const { container } = setupUI();

    await waitFor(() => {
      const offIndicators = screen.getAllByText('OFF');
      expect(offIndicators[0]).toBeVisible();
    });

    const mfaList = screen.getByRole('list');
    const mfaOptions = within(mfaList).getAllByRole('listitem');

    // Should show Setup method
    expect(within(mfaOptions[0]).getByText('Set Up Method')).toBeVisible();

    // Should call the api with correct values
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/getDevices',
      { userId: 'xxxx' },
    );

    expect(container).toMatchSnapshot();
  });
});
