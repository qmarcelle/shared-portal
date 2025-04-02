import PlanContactInformationPage from '@/app/myPlan/planContactInformation/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const renderUI = async () => {
  const page = await PlanContactInformationPage();
  return render(page);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        id: 'testsh112',
        currUsr: {
          plan: {
            memCk: '91722407',
            grpId: '100000',
            sbsbCk: '91722400',
          },
          umpi: '57c85test3ebd23c7db88245',
        },
      },
    }),
  ),
}));

describe('PlanDetailsSection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders plan details correctly on click of view who is covered', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: loggedInUserInfoMockResp,
    });

    const component = await renderUI();

    // Members Api was called
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/member/v1/members/byMemberCk/91722407',
      );
    });

    // expect(screen.getByText(/View Who's Covered/i)).toBeVisible();

    // fireEvent.click(screen.getByText(/View Who's Covered/i));

    expect(screen.getByText('Christmas Hall')).toBeVisible();
    expect(screen.getByText('DOB: 6/29/2009')).toBeVisible();

    expect(component).toMatchSnapshot();
  });

  test('planDetails not displayed when plan type is not available', async () => {
    mockedAxios.get
      .mockResolvedValueOnce({
        data: {},
      })
      .mockResolvedValueOnce({
        data: null,
      });

    const component = await renderUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/api/member/v1/members/byMemberCk/91722407',
      );
    });

    expect(screen.queryByText('Christmas Hall')).not.toBeInTheDocument();
    expect(screen.queryByText('DOB: 6/29/2009')).not.toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });
});
