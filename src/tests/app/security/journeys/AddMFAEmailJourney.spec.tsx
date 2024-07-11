import { AddMFAEmailJourney } from '@/app/security/components/journeys/AddMFAEmailJourney';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
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

describe('Add Mfa Email Journey', () => {
  let component: RenderResult;
  beforeAll(() => {
    const showAppModal = useAppModalStore.getState().showAppModal;
    component = renderUI();
    showAppModal({
      content: <AddMFAEmailJourney email="chall123@gmail.com" />,
    });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup' }),
      ).toBeVisible();
    });
    expect(screen.getByText('chall123@gmail.com')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();

    // Change email screen
    fireEvent.click(screen.getByText(/Change Your Email Address/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Change Email Address' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

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
    const emailEntryInput = screen.getByLabelText(/Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    // Enter code screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByText(
          // eslint-disable-next-line quotes
          "Enter the security code sent to your email to complete email setup.We've sent a code to:",
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          deviceStatus: 'ACTIVE',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'chrishall@abc.com',
        },
      },
    });
    const codeEntryInput = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(codeEntryInput, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Email Setup is Complete' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
