import { AddMFAVoiceJourney } from '@/app/security/components/journeys/AddMFAVoiceJourney';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockedAxios } from '../../../__mocks__/axios';

const renderUI = () => {
  return render(<AppModal />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('test1234')),
}));

describe('Verify Mfa Voice Journey', () => {
  let component: RenderResult;
  beforeEach(() => {
    const { showAppModal, dismissModal } = useAppModalStore.getState();
    dismissModal();
    component = renderUI();
    showAppModal({ content: <AddMFAVoiceJourney initNumber="1234567834" /> });
  });

  it('should call verifyDevices voice api and render appropriate message on axios error', async () => {
    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    // Change Phone Number screen -- on hold
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chall123@gmail.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    await waitFor(async () => {
      const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
      await userEvent.type(phoneEntryInput, '1234567834');
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          'Enter the 6-digit security code you heard to complete voice setup.',
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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

    const securityCode = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(securityCode, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(screen.getByText('Try Again Later')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('verify Mfa Voice Devices 400 error', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    // Change Phone Number screen -- on hold
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chall123@gmail.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    await waitFor(async () => {
      const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
      await userEvent.type(phoneEntryInput, '11111111111');
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          'Enter the 6-digit security code you heard to complete voice setup.',
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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

    const securityCode = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(securityCode, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('verify Mfa Voice Devices 408 error', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    // Change Phone Number screen -- on hold
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chall123@gmail.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    await waitFor(async () => {
      const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
      await userEvent.type(phoneEntryInput, '11111111111');
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          'Enter the 6-digit security code you heard to complete voice setup.',
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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

    const securityCode = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(securityCode, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });

  it('verify Mfa Voice Devices 500 error', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(screen.getByText('Voice Call Setup')).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    // Change Phone Number screen -- on hold
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chall123@gmail.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    await waitFor(async () => {
      const phoneEntryInput = screen.getByLabelText(/Phone Number/i);
      await userEvent.type(phoneEntryInput, '11111111111');
      fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    });
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          'Enter the 6-digit security code you heard to complete voice setup.',
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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

    const securityCode = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(securityCode, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

    await waitFor(() => {
      expect(
        screen.queryByText(
          'There is a problem with the security code. Try re-entering or resending the code.',
        ),
      ).not.toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          "Oops! We're sorry. Something went wrong. Please try again.",
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
