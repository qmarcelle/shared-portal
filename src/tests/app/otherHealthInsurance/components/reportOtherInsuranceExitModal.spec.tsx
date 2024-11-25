import { OtherHealthInsurance } from '@/app/reportOtherHealthInsurance/journeys/OtherHealthInsurance';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { ChildAppModalBody } from '@/components/foundation/ChildAppModalBody';
import '@testing-library/jest-dom';
import {
  RenderResult,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

const mockMemberDetails = {
  member: [
    {
      id: 1,
      dob: '08/06/1959',
    },
  ],
};
const renderUI = () => {
  return render(<AppModal />);
};

describe('Exit Modal Journey', () => {
  let component: RenderResult;
  const showAppModal = useAppModalStore.getState().showAppModal;
  const dismissModal = useAppModalStore.getState().dismissModal;
  const dismissChildModal = useAppModalStore.getState().dismissChildModal;
  beforeEach(() => {
    dismissModal();
    component = renderUI();
    showAppModal({
      content: (
        <OtherHealthInsurance memberDetails={mockMemberDetails.member} />
      ),
      isChildActionAppModal: true,
      childModalContent: (
        <ChildAppModalBody
          key="first"
          label="Are you sure you want to exit?"
          subLabel="Any information you entered will not be saved."
          primaryButtonLabel="Return to Form"
          secondaryButtonLabel="Exit Anyway"
          primaryButtonCallback={dismissChildModal}
          secondaryButtonCallback={dismissModal}
        />
      ),
    });
  });

  it('Should render UI properly', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Other Health Insurance' }),
      ).toBeVisible();
    });
    //click event on close popup
    fireEvent.click(screen.getByAltText(/close/i));

    await waitFor(() => {
      expect(screen.getByText('Are you sure you want to exit?')).toBeVisible();
    });
    expect(
      screen.getByRole('button', { name: /Return to Form/i }),
    ).toBeVisible();
    expect(screen.getByRole('button', { name: /Exit Anyway/i })).toBeVisible();

    fireEvent.click(screen.getByRole('button', { name: /Return to Form/i }));
    await waitFor(() => {
      expect(screen.getByText('Other Health Insurance')).toBeVisible();
    });

    expect(component.baseElement).toMatchSnapshot();
  });
});
