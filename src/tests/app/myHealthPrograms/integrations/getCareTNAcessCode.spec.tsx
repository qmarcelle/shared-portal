import { getAccessCodeDetails } from '@/app/myHealth/healthProgramsResources/myHealthPrograms/actions/getCareTNAccessCode';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedFetch } from '@/tests/setup';
import { fetchRespWrapper } from '@/tests/test_utils';
import { UserRole } from '@/userManagement/models/sessionUser';

const setupUI = async () => {
  return await getAccessCodeDetails();
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
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('btnbluehere');
  });

  test('Care TN access Code - btnbluewell', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Diabetes'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('btnbluewell');
  });

  test('Care TN access Code - btnbluechat', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Depression'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('btnbluechat');
  });

  test('Care TN access Code - ampbluehere', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = [];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('ampbluehere');
  });

  test('Care TN access Code - ampbluewell', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Diabetes'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('ampbluewell');
  });

  test('Care TN access Code - ampbluechat', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Depression'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('ampbluechat');
  });

  test('Care TN access Code - errorScenaio', async () => {
    vRules.user.vRules.isAmplifyMem = true;
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.cmcondition = ['Error'];
    mockedFetch.mockResolvedValueOnce(fetchRespWrapper(memberDetails));
    const result = await setupUI();
    expect(result.data?.careTNAccessCode).toMatch('');
  });
});
