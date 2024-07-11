import { AddMFAAuthenticatorJourney } from '@/app/security/components/journeys/AddMFAAuthenticatorJourney';
import { MfaDeviceType } from '@/app/security/models/mfa_device_type';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = () => {
  render(<AppModal />);
};
const showAppModal = useAppModalStore.getState().showAppModal;
const dismissModal = useAppModalStore.getState().dismissModal;

describe('Update Mfa Authentication Errors', () => {
  it('should render Error slide on error from update device on generic error', async () => {
    mockedAxios.post.mockRejectedValueOnce({});
    setupUI();
    showAppModal({ content: <AddMFAAuthenticatorJourney /> });
    // Should call the api with correct values
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/updateDevices',
        {
          deviceType: MfaDeviceType.authenticator,
          userId: 'akash11!',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });
  it('should render Error slide on error from update device on axios error', async () => {
    const updateError = createAxiosErrorForTest({
      errorObject: {
        data: {},
        details: {
          componentName: 'string',
          componentStatus: 'string',
          returnCode: 'MF-402',
          subSystemName: 'string',
          message: 'string',
          problemTypes: 'string',
          innerDetails: {
            statusDetails: [
              {
                componentName: 'string',
                componentStatus: 'string',
                returnCode: 'string',
                subSystemName: 'string',
                message: 'string',
                problemTypes: 'string',
                innerDetails: {
                  statusDetails: ['string'],
                },
              },
            ],
          },
        },
      },
    });
    mockedAxios.post.mockRejectedValueOnce(updateError);
    dismissModal();
    setupUI();
    showAppModal({ content: <AddMFAAuthenticatorJourney /> });
    // Should call the api with correct values
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/updateDevices',
        {
          deviceType: MfaDeviceType.authenticator,
          userId: 'akash11!',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });
});
