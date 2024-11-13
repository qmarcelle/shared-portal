import { UpdateSocialSecurityNumberJourney } from '@/app/updateSocialSecurityNumber/components/journeys/UpdateSocialSecurityNumber';
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
  return render(<AppModal />);
};

jest.mock('../../../../utils/server_session', () => ({
  getServerSideUserId: jest.fn(() => Promise.resolve('test1234')),
}));

describe('UpdateSocialSecurityNumber Journey', () => {
  let component: RenderResult;
  beforeAll(() => {
    const showAppModal = useAppModalStore.getState().showAppModal;
    component = renderUI();
    showAppModal({
      content: <UpdateSocialSecurityNumberJourney memberName="Chris Hall" />,
    });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', {
          name: 'Update or Add a Social Security Number',
        }),
      ).toBeVisible();
      expect(
        screen.getByText('Enter the social security number for:'),
      ).toBeVisible();
    });
    const phoneEntryInput = screen.getByLabelText(/Social Security Number/i);
    await userEvent.type(phoneEntryInput, '111-22-3333');
    fireEvent.click(screen.getByRole('button', { name: /Save Changes/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          'Your social security number has been successfully updated.',
        ),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
