import { LoginStore, useLoginStore } from '@/app/login/stores/loginStore';
import { AddMFAEmailJourney } from '@/app/security/components/journeys/AddMFAEmailJourney';
import { MfaDeviceType } from '@/app/security/models/mfa_device_type';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const setupUI = () => {
  render(<AppModal />);
};
const { showAppModal, dismissModal } = useAppModalStore.getState();

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('xxxx')),
}));

describe('Update Mfa Email Authentication Errors', () => {
  beforeEach(() => {
    jest
      .spyOn(useLoginStore, 'getState')
      .mockReturnValue({ username: 'xxxx' } as LoginStore);
  });

  it('should render Error slide on error from update device on generic error', async () => {
    mockedAxios.post.mockRejectedValueOnce({});
    setupUI();
    showAppModal({
      content: <AddMFAEmailJourney email={'chall123@gmail.com'} />,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    /* fireEvent.click(screen.getByText(/Change Your Email Address/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Change Email Address' }),
      ).toBeVisible();
    }); */

    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');

    const confirmEmailEntryInput = screen.getByLabelText(/Confirm Email/i);
    await userEvent.type(confirmEmailEntryInput, 'chall123@gmail.com');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/updateDevices',
        {
          deviceType: MfaDeviceType.email,
          email: 'chall123@gmail.com',
          userId: 'xxxx',
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
    showAppModal({
      content: <AddMFAEmailJourney email={'chall123@gmail.com'} />,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    /* fireEvent.click(screen.getByText(/Change Your Email Address/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Change Email Address' }),
      ).toBeVisible();
    }); */

    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');

    const confirmEmailEntryInput = screen.getByLabelText(/Confirm Email/i);
    await userEvent.type(confirmEmailEntryInput, 'chall123@gmail.com');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/mfAuthentication/updateDevices',
        {
          deviceType: MfaDeviceType.email,
          email: 'chall123@gmail.com',
          userId: 'xxxx',
        },
      );
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
  });

  test('Update Mfa Devices 400 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 400,
        errorObject: {
          data: {},
          details: {
            returnCode: 'MF-402',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAEmailJourney email={'chall123@gmail.com'} />,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    /* fireEvent.click(screen.getByText(/Change Your Email Address/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Change Email Address' }),
      ).toBeVisible();
    }); */

    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');

    const confirmEmailEntryInput = screen.getByLabelText(/Confirm Email/i);
    await userEvent.type(confirmEmailEntryInput, 'chall123@gmail.com');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });

  test('Update Mfa Devices 408 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 408,
        errorObject: {
          data: {},
          details: {
            returnCode: 'MF-402',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAEmailJourney email={'chall123@gmail.com'} />,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    /* fireEvent.click(screen.getByText(/Change Your Email Address/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Change Email Address' }),
      ).toBeVisible();
    }); */

    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');

    const confirmEmailEntryInput = screen.getByLabelText(/Confirm Email/i);
    await userEvent.type(confirmEmailEntryInput, 'chall123@gmail.com');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });

  test('Update Mfa Devices 500 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 500,
        errorObject: {
          data: {},
          details: {
            returnCode: 'MF-402',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAEmailJourney email={'chall123@gmail.com'} />,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    /* fireEvent.click(screen.getByText(/Change Your Email Address/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Change Email Address' }),
      ).toBeVisible();
    }); */

    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');

    const confirmEmailEntryInput = screen.getByLabelText(/Confirm Email/i);
    await userEvent.type(confirmEmailEntryInput, 'chall123@gmail.com');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
  });

  test('Update Mfa Devices 400-17 error', async () => {
    mockedAxios.post.mockRejectedValueOnce(
      createAxiosErrorForTest({
        status: 400,
        errorObject: {
          data: {},
          details: {
            returnCode: 'RE-400-17',
          },
        },
      }),
    );
    dismissModal();
    setupUI();
    showAppModal({
      content: <AddMFAEmailJourney email={'chall123@gmail.com'} />,
    });

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });

    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');

    const confirmEmailEntryInput = screen.getByLabelText(/Confirm Email/i);
    await userEvent.type(confirmEmailEntryInput, 'chall123@gmail.com');

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          'The email address entered is already in use by another account. Please choose a different email address.',
        ),
      ).toBeVisible();
    });
  });
});
