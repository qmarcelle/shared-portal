import MyHealthProgramsPage from '@/app/myHealthPrograms/page';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MyHealthProgramsPage();
  render(Result);
};

describe('Care TN Access Code', () => {
  test('Care TN access Code - btnbluehere', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.isAmplifyMem = false;
    memberDetails.cmCondtion = '';
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluehere'));
    });
  });

  test('Care TN access Code - btnbluewell', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.isAmplifyMem = false;
    memberDetails.cmCondtion = 'Diabetes';
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluewell'));
    });
  });

  test('Care TN access Code - btnbluechat', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.isAmplifyMem = false;
    memberDetails.cmCondtion = 'Depression';
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('btnbluechat'));
    });
  });
  test('Care TN access Code - ampbluehere', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.cmCondtion = '';
    memberDetails.isAmplifyMem = true;
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluehere'));
    });
  });

  test('Care TN access Code - ampbluewell', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.cmCondtion = 'Diabetes';
    memberDetails.isAmplifyMem = true;
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluewell'));
    });
  });
  test('Care TN access Code - ampbluechat', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.cmCondtion = 'Depression';
    memberDetails.isAmplifyMem = true;
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('ampbluechat'));
    });
  });

  test('Care TN access Code - errorScenaio', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.cmCondtion = 'Error';
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));
    await setupUI();
    await waitFor(() => {
      expect(screen.getAllByText('Access code could not load.'));
    });
  });
});
