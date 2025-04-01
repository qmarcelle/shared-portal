import UpdateMyPrimaryCareProviderPage from '@/app/updateMyPrimaryCareProvider/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: { memCk: '641613650', grpId: '87898', sbsbCk: '654567656' },
        },
      },
    }),
  ),
}));

const setupUI = async () => {
  const result = await UpdateMyPrimaryCareProviderPage();
  render(result);
};

describe('Send Email Request API Integration', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('Send Email Request  API integration Failure scenario', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      message: 'Failure',
    });

    await setupUI();
    const inputProviderName = screen.getByLabelText(
      'Name of Provider (First & Last Name)',
    );
    const inputCity = screen.getByLabelText(/City/i);
    const inputAddres = screen.getByLabelText(/Street Address/i);
    const inputState = screen.getByLabelText(/State/i);
    const inputCounty = screen.getByLabelText(/County/i);
    const inputZipCode = screen.getByLabelText(/ZIP Code/i);
    const inputPhoneNumber = screen.getByLabelText(/Phone Number/i);
    const submitButton = screen.getByRole('button', {
      name: /Submit Request/i,
    });
    await userEvent.type(inputProviderName, 'James Louthan');
    await userEvent.type(inputAddres, '2033 Meadowview Ln Ste 300');
    await userEvent.type(inputCity, 'KINGSPORT');
    await userEvent.type(inputCounty, 'Shleby');
    await userEvent.type(inputState, 'TN');
    await userEvent.type(inputZipCode, '12345');
    await userEvent.type(inputPhoneNumber, '1234567890');
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/pcPhysician/641613650', {
        physicianName: 'James Louthan',
        physicianAddress: '2033 Meadowview Ln Ste 300',
        physicianCity: 'KINGSPORT',
        physicianState: 'TN',
        physicianZip: '12345',
        physicianCounty: 'Shleby',
        contactName: 'CHRISTMAS HALL',
        contactPhone: '1234567890',
        contactRelation: 'Self',
        subscriberID: '902218823',
        subscriberName: 'CHRIS HALL',
        memberCK: '641613650',
      });
    });
    screen.getByText('Try Again Later');
  });
});
