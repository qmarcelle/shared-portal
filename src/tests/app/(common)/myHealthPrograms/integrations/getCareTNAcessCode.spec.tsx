import MyHealthProgramsPage from '@/app/(protected)/(common)/member/myhealth/healthProgramsResources/myHealthPrograms/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MyHealthProgramsPage();
  render(Result);
};

const vRules = {
  user: {
    currUsr: {
      umpi: '57c85test3ebd23c7db88245',
      role: UserRole.MEMBER,
      plan: {
        fhirId: '654543434',
        grgrCk: '7678765456',
        grpId: '65654323',
        memCk: '502622001',
        sbsbCk: '5654566',
        subId: '56543455',
      },
    },
    vRules: {
      isAmplifyMem: false,
    },
  },
};

jest.mock('src/auth', () => ({
  auth: () => vRules,
}));

describe('Care TN Access Code', () => {
  test('Care TN access Code - btnbluehere', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = [];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluehere'));
    });
  });

  test('Care TN access Code - btnbluewell', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Diabetes'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluewell'));
    });
  });

  test('Care TN access Code - btnbluechat', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Depression'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluechat'));
    });
  });

  test('Care TN access Code - ampbluehere', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = [];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluehere'));
    });
  });

  test('Care TN access Code - ampbluewell', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Diabetes'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluewell'));
    });
  });

  test('Care TN access Code - ampbluechat', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Depression'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluechat'));
    });
  });

  test('Care TN access Code - errorScenaio', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Error'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('Access code could not load.'));
    });
  });
});
