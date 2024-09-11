import { LoginStore, useLoginStore } from '@/app/login/stores/loginStore';
import { SecuritySettings } from '@/app/security/components/SecuritySettingsComponent';
import { GetMfaDevices } from '@/app/security/models/get_mfa_devices';
import { MfaDeviceType } from '@/app/security/models/mfa_device_type';
import { ESResponse } from '@/models/enterprise/esResponse';
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { mockedAxios } from '../../../__mocks__/axios';

//jest.setTimeout(30000);
const setupUI = () => {
  render(<SecuritySettings username="Testuser" />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));

describe('Toggle Mfa', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should toggle from off to on correctly', async () => {
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

    mockedAxios.put.mockResolvedValueOnce({
      data: {
        data: {
          mfaEnabled: 'true',
        },
      },
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

    await waitFor(() => {
      // Toggle Mfa api was called
      expect(mockedAxios.put).toHaveBeenCalledWith(
        '/mfAuthentication/mfaEnableDisable',
        { userId: 'xxxx', mfaEnabled: 'true' },
      );
      expect(screen.getByText('MFA is turned on.'));
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "We'll send a one-time security code to your email by default. Set up multiple methods for more options when you log in.",
        ),
      ).toBeVisible();
    });

    // The Mfa devices list should show up
    await waitFor(() => {
      const onIndicators = screen.getAllByText('ON');
      expect(onIndicators[0]).toBeVisible();
    });

    const mfaList = screen.getByRole('list');
    const mfaOptions = within(mfaList).getAllByRole('listitem');

    // Should show enabled and Remove Option for Email, Text and Voice
    // Email
    within(mfaOptions[1]).getByText('Email Message');
    expect(within(mfaOptions[1]).getAllByText('ON')[0]).toBeVisible();
    expect(
      within(mfaOptions[1]).getByText(
        'Send a security code to testEmail@bcbst.com.',
      ),
    ).toBeVisible();
    expect(within(mfaOptions[1]).getByText('Remove Method')).toBeVisible();

    // Text
    within(mfaOptions[2]).getByText('Text Message');
    expect(within(mfaOptions[2]).getAllByText('ON')[0]).toBeVisible();
    expect(
      within(mfaOptions[2]).getByText(
        'Send a security code to (467) 589-6875.',
      ),
    ).toBeVisible();
    expect(within(mfaOptions[2]).getByText('Remove Method')).toBeVisible();

    // Voice
    within(mfaOptions[3]).getByText('Voice Call');
    expect(within(mfaOptions[3]).getAllByText('ON')[0]).toBeVisible();
    expect(
      within(mfaOptions[3]).getByText(
        'Send a security code to (467) 589-6875.',
      ),
    ).toBeVisible();
    expect(within(mfaOptions[3]).getByText('Remove Method')).toBeVisible();

    // Should show disabled and Setup Option for Authenticator
    within(mfaOptions[0]).getByText('Authenticator App');
    expect(within(mfaOptions[0]).getAllByText('OFF')[0]).toBeVisible();
    expect(
      within(mfaOptions[0]).queryByText(
        // eslint-disable-next-line quotes
        "Use your authenticator app's security code",
      ),
    ).toBeUndefined;
    expect(within(mfaOptions[0]).getByText('Set Up Method')).toBeVisible();
  });
});
