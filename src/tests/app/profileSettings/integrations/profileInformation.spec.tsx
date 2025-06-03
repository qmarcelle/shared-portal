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
    expect(component).toMatchSnapshot();
  });
  test('Profile Information Email and Phone Number API Service load failure', async () => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
    mockedAxios.get.mockResolvedValueOnce({
      status: 400,
      data: {
        email: '',
        phone: '',
        memberDetails: { fullName: '', dob: '' },
        // visibilityRules: session?.user.vRules,
      },
    });

    const component = await setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/contact', {
        params: { umpi: '57c85test3ebd23c7db88245' },
      });
    });
    expect(screen.getByText('Profile Information')).toBeVisible();
    const phone = screen.queryByText('Phone Number');
    expect(phone).not.toBeInTheDocument();
    const email = screen.queryByText('Email Address');
    expect(email).not.toBeInTheDocument();

    expect(
      screen.getByText(
        /We can't load your profile right now. Please try again later./i,
      ),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
  test('Profile Information Email and Phone Number empty scenario', async () => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          email: '',
          email_verified_flag: true,
          phone: '',
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
    expect(screen.getByText('Email Address')).toBeVisible();

    expect(screen.getByText('No phone number on file.')).toBeVisible();
    expect(screen.getByText('No email address on file.')).toBeVisible();
    expect(component).toMatchSnapshot();
  });
  test('Profile Information Email and Phone Number Verfication Needed', async () => {
    mockedFetch.mockResolvedValue(fetchRespWrapper(loggedInUserInfoMockResp));
    mockedAxios.get.mockResolvedValueOnce({
      status: 200,
      data: {
        data: {
          email: 'demo@bcbst.com',
          email_verified_flag: false,
          phone: '7654387656',
          phone_verified_flag: false,
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
    expect(screen.getByText('Email Address')).toBeVisible();

    expect(screen.getByText('Please confirm your phone number.')).toBeVisible();
    expect(
      screen.getByText('Please confirm your email address.'),
    ).toBeVisible();
    expect(component).toMatchSnapshot();
  });
});
