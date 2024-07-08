import { InviteToRegister } from '@/app/accessOthersInformation/journeys/InviteToRegister';
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

const renderUI = () => {
  return render(
    <>
      <AppModal />
    </>,
  );
};

describe('Invite to Register', () => {
  const showAppModal = useAppModalStore.getState().showAppModal;
  let component: RenderResult;
  beforeAll(() => {
    component = renderUI();
    showAppModal({ content: <InviteToRegister memberName="Corey Hall" /> });
  });

  it('Invite to Register', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Invite to Register' }),
      ).toBeVisible();
    });
    expect(screen.getByText('Corey Hall')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();

    const emailEntryInput = screen.getByLabelText(/Their Email Address/i);
    await userEvent.type(emailEntryInput, 'chall123@gmail.com');
    fireEvent.click(screen.getByRole('button', { name: /Send Invite/i }));

    expect(component.baseElement).toMatchSnapshot();

    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Invitation to Register Sent' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
