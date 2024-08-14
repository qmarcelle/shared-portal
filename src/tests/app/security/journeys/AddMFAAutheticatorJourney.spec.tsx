import { AddMFAAuthenticatorJourney } from '@/app/security/components/journeys/AddMFAAuthenticatorJourney';
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

describe('Authenticator App Setup', () => {
  let component: RenderResult;
  beforeAll(() => {
    const showAppModal = useAppModalStore.getState().showAppModal;
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        data: {
          message: 'Phone already registered.',
          deviceType: 'SMS',
          deviceStatus: 'ACTIVATION_REQUIRED',
          createdAt: '2024-02-09T12:40:33.554Z',
          updatedAt: '2024-02-09T12:40:33.554Z',
          phone: '11111111111',
          email: 'thomas@abc.com',
          secret: 'ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
          keyUri:
            'otpauth://totp/thomas@abc.com?secret=ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ',
        },
      },
    });
    component = renderUI();
    showAppModal({ content: <AddMFAAuthenticatorJourney /> });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Authenticator App Setup' }),
      ).toBeVisible();
      expect(screen.getByText('Secret Key:')).toBeVisible();
      expect(
        screen.getByText('ZEHLSQVDBQACU44JEF2BGVJ45KHFRDYJ'),
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
          email: 'thomas@abc.com',
        },
      },
    });

    const codeEntryInput = screen.getByLabelText(/Enter Security Code/i);
    await userEvent.type(codeEntryInput, '123456');
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Authenticator App Setup Complete',
        }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
