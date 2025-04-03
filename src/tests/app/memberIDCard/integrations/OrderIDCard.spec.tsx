import { OrderIdCard } from '@/app/memberIDCard/journeys/OrderIdCard';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { createAxiosErrorForTest, fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

const renderUI = () => {
  return render(<AppModal />);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '100000',
            sbsbCk: '91722400',
          },
        },
      },
    }),
  ),
}));

const IdCardMemberDetailsMockResponse = {
  first_name: 'JENNIE',
  last_name: 'RAMAGE',
  contact: {
    type: 'H',
    address1: 'PO BOX 102',
    address2: '',
    address3: '',
    city: 'BURLINGTON',
    state: 'PA',
    zipcode: '188140102',
    county: 'BRADFORD',
    email: '',
    phone: '9738278333',
  },
  memberRelation: 'M',
  noOfDependents: 1,
};

describe('OrderId Card', () => {
  const showAppModal = useAppModalStore.getState().showAppModal;
  const dismissAppModal = useAppModalStore.getState().dismissModal;
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    dismissAppModal();
    renderUI();
    showAppModal({
      content: <OrderIdCard memberDetails={IdCardMemberDetailsMockResponse} />,
    });
  });

  it('should test OrderIDCard with MemberRelation M with 200', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });

    //Select Number of Cards
    const inputText = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByAltText('Up Icon'));
    expect(inputText).toHaveValue(1);

    //After Selecting Number Of Cards, Proceed with Next Button.
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('1 new cards will be mailed to this address:'),
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
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/Order?subscriberCk=91722400&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&numOfCards=1`,
      );
    });
  });

  it('should Render Error Screen when OrderIDCard return 200 but returnCode is not 0', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });

    //Select Number of Cards
    const inputText = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByAltText('Up Icon'));
    expect(inputText).toHaveValue(1);

    //After Selecting Number Of Cards, Proceed with Next Button.
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('1 new cards will be mailed to this address:'),
      ).toBeVisible();
    });
    const memberDetails = memberMockResponse;
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        retcode: 1,
      },
    });
    //After Address confirmation, Proceed with Complete Order Button.
    fireEvent.click(screen.getByRole('button', { name: /Complete Order/i }));
    await waitFor(() => {
      expect(screen.getByText('Order Incomplete')).toBeVisible();
      expect(
        screen.getByText(
          'Something went wrong while processing your ID card order. Please try again later.',
        ),
      ).toBeVisible();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/Order?subscriberCk=91722400&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&numOfCards=1`,
      );
    });
  });

  it('should Render Error Screen when OrderIDCard return 400', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });

    //Select Number of Cards
    const inputText = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByAltText('Up Icon'));
    expect(inputText).toHaveValue(1);

    //After Selecting Number Of Cards, Proceed with Next Button.
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('1 new cards will be mailed to this address:'),
      ).toBeVisible();
    });
    mockedAxios.post.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );
    //After Address confirmation, Proceed with Complete Order Button.
    fireEvent.click(screen.getByRole('button', { name: /Complete Order/i }));
    await waitFor(() => {
      expect(screen.getByText('Something went wrong.')).toBeVisible();
      expect(
        screen.getByText(
          'We’re unable to take orders for printed ID cards at this time. Please try again later.',
        ),
      ).toBeVisible();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/Order?subscriberCk=91722400&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&numOfCards=1`,
      );
    });
  });

  it('should Render Error Screen when OrderIDCard return 500', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });

    //Select Number of Cards
    const inputText = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByAltText('Up Icon'));
    expect(inputText).toHaveValue(1);

    //After Selecting Number Of Cards, Proceed with Next Button.
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('1 new cards will be mailed to this address:'),
      ).toBeVisible();
    });

    mockedAxios.post.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );
    //After Address confirmation, Proceed with Complete Order Button.
    fireEvent.click(screen.getByRole('button', { name: /Complete Order/i }));
    await waitFor(() => {
      expect(screen.getByText('Something went wrong.')).toBeVisible();
      expect(
        screen.getByText(
          'We’re unable to take orders for printed ID cards at this time. Please try again later.',
        ),
      ).toBeVisible();
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/Order?subscriberCk=91722400&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&numOfCards=1`,
      );
    });
  });

  xit('should test OrderIDCard with MemberRelation S with 200', async () => {
    // Init Screen is rendered correctly
    await waitFor(async () => {
      expect(
        screen.getByRole('heading', { name: 'Order New ID Card' }),
      ).toBeVisible();
    });

    //Select Number of Cards
    const inputText = screen.getByRole('spinbutton');
    fireEvent.click(screen.getByAltText('Up Icon'));
    expect(inputText).toHaveValue(1);

    //After Selecting Number Of Cards, Proceed with Next Button.
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    await waitFor(() => {
      expect(
        screen.getByText('1 new cards will be mailed to this address:'),
      ).toBeVisible();
    });

    const memberDetails = memberMockResponse;
    memberDetails.memberRelation = 'S';
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));

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
      expect(mockedAxios.post).toHaveBeenCalledWith(
        `/Order?memberCk=91722407,&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&numOfCards=1`,
      );
    });
  });
});
