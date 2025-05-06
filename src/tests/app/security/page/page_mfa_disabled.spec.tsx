import { LoginStore, useLoginStore } from '@/app/(protected)/(common)/member/login/stores/loginStore';
import { SecuritySettings } from '@/app/(protected)/(common)/member/security/components/SecuritySettingsComponent';
import { GetMfaDevices } from '@/app/(protected)/(common)/member/security/models/get_mfa_devices';
import { MfaDeviceType } from '@/app/(protected)/(common)/member/security/models/mfa_device_type';
import { metadata } from '@/app/(protected)/(common)/member/security/page';
import { ESResponse } from '@/models/enterprise/esResponse';
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

  it('should have the correct title', () => {
    expect(metadata.title).toBe('Security Settings');
  });

  it('should render page correctly when mfa is disabled', async () => {
    // Api sends Text, Voice, Email as Active
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          mfaEnabled: 'false',
          devices: [
            {
              deviceType: MfaDeviceType.text,
              deviceStatus: 'ACTIVE',
              createdAt: 'string',
              updatedAt: 'string',
              phone: '54675896875',
              email: 'string',
            },
            {
              deviceType: MfaDeviceType.voice,
              deviceStatus: 'ACTIVE',
              createdAt: 'string',
              updatedAt: 'string',
              phone: '54675896875',
              email: 'string',
            },
            {
              deviceType: MfaDeviceType.email,
              deviceStatus: 'ACTIVE',
              createdAt: 'string',
              updatedAt: 'string',
              phone: '',
              email: 'testEmail@bcbst.com',
            },
          ],
        },
      } satisfies ESResponse<GetMfaDevices>,
    });

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
    expect(screen.getByLabelText('toggle mfa')).toBeVisible();
    expect(screen.getByText('MFA is turned off.'));

    expect(container).toMatchSnapshot();
  });
});
