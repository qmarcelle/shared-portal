import SendAnEmailPage from '@/app/support/sendAnEmail/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));

const setupUI = async () => {
  const result = await SendAnEmailPage();
  render(result);
};

describe('Send Email  API Integration', () => {
  test('Send Email  API integration success scenario', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        message: 'Success',
      },
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
        dependentName: 'CHRIS HALL',
        category: 'D',
        groupID: '100000',
        name: 'CHRIS HALL',
        planID: 'MBPX0806',
        subscriberID: '91722400',
        memberDOB: '08/06/1959',
      });
    });
    screen.getByText('Got it!');
  });
});
