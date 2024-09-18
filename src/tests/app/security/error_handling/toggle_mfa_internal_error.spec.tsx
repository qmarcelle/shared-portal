import { LoginStore, useLoginStore } from '@/app/login/stores/loginStore';
import { SecuritySettings } from '@/app/security/components/SecuritySettingsComponent';
import { GetMfaDevices } from '@/app/security/models/get_mfa_devices';
import { MfaDeviceType } from '@/app/security/models/mfa_device_type';
import { useSecuritySettingsStore } from '@/app/security/stores/security_settings_store';
import { ESResponse } from '@/models/enterprise/esResponse';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { mockedAxios } from '../../../__mocks__/axios';

//jest.setTimeout(30000);
const setupUI = () => {
  render(<SecuritySettings username="Testuser" />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));

describe('Toggle Mfa Error Handling', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
    jest
      .spyOn(useSecuritySettingsStore.getState(), 'toggleMfaDevices')
      .mockImplementationOnce(() => {
        throw new Error();
      });
  });
  it('should show error card on Application errors from toggle off to on', async () => {
    // Api sends mfa disabled
    mockedAxios.post
      .mockResolvedValueOnce({
        data: {
          data: {
            mfaEnabled: 'false',
            devices: [],
          },
        } satisfies ESResponse<GetMfaDevices>,
      })
      // Api sends Text, Voice, Email as Active
      .mockResolvedValueOnce({
        data: {
          data: {
            mfaEnabled: 'true',
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

    setupUI();

    await waitFor(() => {
      // Should call the api with correct values
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/getDevices',
        { userId: 'xxxx' },
      );
    });

    // Should show the toggle mfa UI
    // Mfa Toggle UI should show for OFF
    expect(screen.getByText('MFA is turned off.'));
    expect(
      screen.getByText(
        // eslint-disable-next-line quotes
        'Turn on MFA to keep your account more secure.',
      ),
    ).toBeVisible();

    // Click toggle Mfa
    const toggleSwitch = screen.getByLabelText('toggle mfa');
    fireEvent.click(toggleSwitch);

    // Error slide for Toggle should show up
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "We're sorry. We weren't able to update your MFA settings. Please try again later.",
        ),
      ).toBeVisible();
    });

    // GetMfa should not be called
    expect(mockedAxios.get).not.toHaveBeenNthCalledWith(2);

    // Toggle Mfa Api was not called
    // Toggle Mfa api was called
    expect(mockedAxios.put).not.toHaveBeenCalledWith(
      '/mfAuthentication/mfaEnableDisable',
    );
  });
});
