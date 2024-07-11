import { AddMFAVoiceJourney } from '@/app/security/components/journeys/AddMFAVoiceJourney';
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

describe('Add Mfa Voice Journey', () => {
  let component: RenderResult;
  beforeAll(() => {
    const showAppModal = useAppModalStore.getState().showAppModal;
    component = renderUI();
    showAppModal({ content: <AddMFAVoiceJourney initNumber="1234567834" /> });
  });

  it('should render the screens correctly', async () => {
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
        screen.getByRole('heading', { name: 'Voice Call Setup is Complete' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
