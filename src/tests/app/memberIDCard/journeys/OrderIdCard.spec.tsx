import { OrderIdCard } from '@/app/memberIDCard/journeys/OrderIdCard';
import { AppModal, useAppModalStore } from '@/components/foundation/AppModal';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
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
  noOfDependents: 4,
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testUser',
        currUsr: {
          umpi: '57c85test3ebd23c7db88245',
          role: UserRole.MEMBER,
          plan: {
            fhirId: '654543434',
            grgrCk: '7678765456',
            grpId: '65654323',
            memCk: '123456789',
            sbsbCk: '5654566',
            subId: '56543455',
          },
        },
        vRules: {},
      },
    }),
  ),
}));

describe('OrderId Card', () => {
  let component: RenderResult;
  const showAppModal = useAppModalStore.getState().showAppModal;
  const dismissAppModal = useAppModalStore.getState().dismissModal;
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
    dismissAppModal();
    component = renderUI();

    showAppModal({
      content: <OrderIdCard memberDetails={IdCardMemberDetailsMockResponse} />,
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
