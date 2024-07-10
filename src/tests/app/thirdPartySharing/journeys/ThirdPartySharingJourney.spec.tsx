import { ThirdPartySharingJourney } from '@/app/thirdPartySharing/components/journeys/ThirdPartySharingJourney';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import '@testing-library/jest-dom';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const renderUI = () => {
  return render(<AppModal />);
};
describe('Third Party Sharing Journey', () => {
  let component: RenderResult;
  beforeAll(() => {
    const showAppModal = useAppModalStore.getState().showAppModal;
    component = renderUI();
    showAppModal({
      content: <ThirdPartySharingJourney appName="Apple Health" />,
    });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Stop Sharing' }),
      ).toBeVisible();
    });
    expect(screen.getByText('Apple Health')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();

    // Confirm Sharing screen
    fireEvent.click(screen.getByText(/Confirm/i));
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Sharing Stopped' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
