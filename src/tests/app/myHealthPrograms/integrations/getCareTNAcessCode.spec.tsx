import MyHealthProgramsPage from '@/app/myHealth/healthProgramsResources/myHealthPrograms/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MyHealthProgramsPage();
  render(Result);
};

const vRules = {
  user: {
    currUsr: { plan: { memCk: '123456789' } },
    vRules: {
      isAmplifyMem: false,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: jest.fn(),
}));

describe('Care TN Access Code', () => {
  test('Care TN access Code - btnbluehere', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = [];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluehere'));
    });
  });

  test('Care TN access Code - btnbluewell', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Diabetes'];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluewell'));
    });
  });

  test('Care TN access Code - btnbluechat', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Depression'];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluechat'));
    });
  });

  test('Care TN access Code - ampbluehere', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = [];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluehere'));
    });
  });

  test('Care TN access Code - ampbluewell', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Diabetes'];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluewell'));
    });
  });

  test('Care TN access Code - ampbluechat', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Depression'];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluechat'));
    });
  });

  test('Care TN access Code - errorScenaio', async () => {
    const mockAuth = jest.requireMock('src/auth').auth;
    mockAuth.mockResolvedValueOnce(vRules);
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Error'];
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('Access code could not load.'));
    });
  });
});
