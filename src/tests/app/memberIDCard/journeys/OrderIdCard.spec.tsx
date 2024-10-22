import { OrderIdCard } from '@/app/memberIDCard/journeys/OrderIdCard';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import {
  fireEvent,
  render,
  RenderResult,
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

describe('OrderId Card', () => {
  let component: RenderResult;
  const showAppModal = useAppModalStore.getState().showAppModal;
  const dismissAppModal = useAppModalStore.getState().dismissModal;
  beforeEach(() => {
    dismissAppModal();
    component = renderUI();
    const memberDetails = memberMockResponse;
    memberDetails.noOfDependents = 4;
    showAppModal({
      content: <OrderIdCard memberDetails={memberDetails} />,
    });
  });

  it('should render the screens correctly', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });

    //Test Whether the input functionality of Increment & Decrement Operation
    const inputText = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByAltText('Up Icon'));
    expect(inputText).toHaveValue(2);
    fireEvent.click(screen.getByAltText('Down Icon'));
    expect(inputText).toHaveValue(1);
    await userEvent.type(inputText, '12');
    expect(inputText).toHaveValue(1);
    await userEvent.type(inputText, '{ArrowDown}');
    expect(inputText).toHaveValue(1);
    await userEvent.type(inputText, '{ArrowUp}');
    expect(inputText).toHaveValue(2);

    //After Selecting Number Of Cards, Proceed with Next Button.
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('2 new cards will be mailed to this address:'),
      ).toBeVisible();
    });

    mockedAxios.post.mockResolvedValueOnce({
      data: {
        retcode: 0,
      },
    });
    //After Address confirmation, Proceed with Complete Order Button.
    fireEvent.click(screen.getByRole('button', { name: /Complete Order/i }));
    await waitFor(() => {
      expect(
        screen.getByText(
          'Your new cards will be mailed to your address in 7–14 business days.',
        ),
      ).toBeVisible();
    });

    expect(component.baseElement).toMatchSnapshot();
  });
});
