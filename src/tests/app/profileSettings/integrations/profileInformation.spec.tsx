import ProfileSettingsPage from '@/app/profileSettings/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const result = await ProfileSettingsPage();
  render(result);
};

jest.mock('src/auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          plan: {
            grpId: '100000',
            sbsbCk: '91722400',
            memCk: '91722407',
          },
          umpi: '57c85test3ebd23c7db88245',
        },
      },
    }),
  ),
}));

describe('Profile Information API Integration', () => {
  test('Profile Information Email and Phone Number API Integration success scenario', async () => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {
          email: 'demo@bcbst.com',
          email_verified_flag: true,
          phone: '7654387656',
          phone_verified_flag: true,
          umpi: 'pool5',
        },
      },
    });
    const component = await setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/contact', {
        params: { umpi: '57c85test3ebd23c7db88245' },
      });
    });
    expect(screen.getByText('Profile Information')).toBeVisible();
    expect(screen.getByText('Phone Number')).toBeVisible();
    expect(screen.getByText('7654387656')).toBeVisible();
    expect(screen.getByText('Email Address')).toBeVisible();
    expect(screen.getByText('demo@bcbst.com')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
  test('Profile Information Email and Phone Number API integration Failure scenario', async () => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: {},
      },
    });
    const component = await setupUI();

    await waitFor(() => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        '/contact',
        {
          params: { umpi: '57c85test3ebd23c7db88245' },
        },
      );
      expect(response).toBeNull;
    });
    const phone = screen.queryByText('7654387656');
    expect(phone).not.toBeInTheDocument();
    const email = screen.queryByText('demo@bcbst.com');
    expect(email).not.toBeInTheDocument();
  });
});
