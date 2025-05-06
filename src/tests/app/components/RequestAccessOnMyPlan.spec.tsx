import { RequestAccessOnMyPlan } from '@/app/(protected)/(common)/member/accessOthersInformation/journeys/RequestAccessOnMyPlan';
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
  return render(
    <>
      <AppModal />
    </>,
  );
};

describe('Requesting access on my plan', () => {
  const showAppModal = useAppModalStore.getState().showAppModal;
  let component: RenderResult;
  beforeAll(() => {
    component = renderUI();
    showAppModal({
      content: <RequestAccessOnMyPlan memberName="Forest Hall" />,
    });
  });

  it('Requesting access on my plan', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Request Access' }),
      ).toBeVisible();
    });
    expect(screen.getByText('Forest Hall')).toBeVisible();
    expect(component.baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByRole('button', { name: /Send Request/i }));

    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Access Request Sent' }),
      ).toBeVisible();
      expect(component.baseElement).toMatchSnapshot();
    });
  });
});
