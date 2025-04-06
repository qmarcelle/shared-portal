import SendAnEmailPage from '@/app/support/sendAnEmail/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const setupUI = async () => {
  const result = await SendAnEmailPage();
  render(result);
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

describe('Send Email  API Integration', () => {
  test('Send Email  API integration Failure scenario', async () => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
    mockedAxios.post.mockRejectedValueOnce({
      message: 'Failure',
    });

    await setupUI();
    const helpDropdown = screen.getByText('Select');
    fireEvent.click(helpDropdown);
    fireEvent.click(screen.getByText('Dental'));
    const textArea = screen.getByPlaceholderText('Add your message here...');
    await userEvent.type(textArea, 'test');
    fireEvent.click(screen.getByText('Send Email'));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/contactusemail', {
        memberEmail: '',
        contactNumber: '1-800-565-9140',
        message: 'test',
        categoryValue: 'Dental',
        dependentName: 'CHRISTMAS HALL',
        category: 'D',
        groupID: '100000',
        name: 'CHRIS HALL',
        planID: 'MBPX0806',
        subscriberID: '91722400',
        memberDOB: '08/06/1959',
      });
    });
    screen.getByText('Try Again Later');
  });
});
