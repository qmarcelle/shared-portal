import SendAnEmailPage from '@/app/support/email/page';
import { mockedAxios } from '@/tests/__mocks__/axios';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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
    fireEvent.click(screen.getByText('Send Email'));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/memberservice/api/v1/contactusemail',
        {
          memberEmail: '',
          contactNumber: '1-800-565-9140',
          message: '',
          categoryValue: '43',
          dependentName: 'CHRIS HALL',
          category: 'M',
          groupID: '100000',
          name: 'CHRIS HALL',
          planID: 'MBPX0806',
          subscriberID: '91722400',
          memberDOB: '08/06/1959',
        },
      );
    });
  });

  test('Send Email  API integration Failure scenario', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      message: 'Failure',
    });

    await setupUI();
    fireEvent.click(screen.getByText('Send Email'));
    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/memberservice/api/v1/contactusemail',
        {
          memberEmail: '',
          contactNumber: '1-800-565-9140',
          message: '',
          categoryValue: '43',
          dependentName: 'CHRIS HALL',
          category: 'M',
          groupID: '100000',
          name: 'CHRIS HALL',
          planID: 'MBPX0806',
          subscriberID: '91722400',
          memberDOB: '08/06/1959',
        },
      );
    });
  });
});
