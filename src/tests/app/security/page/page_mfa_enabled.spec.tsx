import { LoginStore, useLoginStore } from '@/app/(protected)/(common)/member/login/stores/loginStore';
import { SecuritySettings } from '@/app/(protected)/(common)/member/security/components/SecuritySettingsComponent';
import { GetMfaDevices } from '@/app/(protected)/(common)/member/security/models/get_mfa_devices';
import { MfaDeviceType } from '@/app/(protected)/(common)/member/security/models/mfa_device_type';
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

describe('Security Page', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });
  it('should render page correctly when mfa is enabled', async () => {
    // Api sends Text, Voice, Email as Active
    mockedAxios.post.mockResolvedValueOnce({
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

    const { container } = setupUI();

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

    // Should call the api with correct values
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/mfAuthentication/getDevices',
      { userId: 'xxxx' },
    );

    //Toggle Button should be present
    expect(screen.getByLabelText('toggle mfa')).toBeVisible();

    expect(container).toMatchSnapshot();
  });
});
