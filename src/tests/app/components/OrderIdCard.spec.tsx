import { OrderIdCard } from '@/app/memberIDCard/journeys/OrderIdCard';
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

describe('Order ID Card', () => {
  const showAppModal = useAppModalStore.getState().showAppModal;
  let component: RenderResult;
  beforeAll(() => {
    component = renderUI();
    showAppModal({ content: <OrderIdCard dependentCount={3} /> });
  });

  it('Order ID Card', async () => {
    // Init Screen is rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });
    expect(
      screen.getByText(
        'Select the number of ID cards you want to order. They will be mailed to your address in 7-14 business days.',
      ),
    ).toBeVisible();
    screen.getByText('Number of ID cards:');

    expect(component.baseElement).toMatchSnapshot();

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));

    screen.getByText('Confirm Your Contact Information');
    fireEvent.click(screen.getByRole('button', { name: /Complete Order/i }));

    expect(component.baseElement).toMatchSnapshot();

    // Success screen rendered correctly
    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Order Complete' }),
      ).toBeVisible();
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
