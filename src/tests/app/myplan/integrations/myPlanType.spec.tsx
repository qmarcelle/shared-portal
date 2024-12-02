import { CardType } from '@/app/myPlan/model/api/card_type';
import { ExtensionType } from '@/app/myPlan/model/api/extension_type';
import MyPlanPage from '@/app/myPlan/page';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const page = await MyPlanPage();
  render(page);
};

jest.mock('../../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({ user: { currUsr: { plan: { memCk: '846239401' } } } }),
  ),
}));

describe('Plan Type Details', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const planDetails = [
    {
      planId: 'GBPEE001',
      planType: 'M',
      planTypeDesc: 'Medical Product',
      planName: 'Blue Network P EPO',
      effectiveDate: '01-01-2020',
      termDate: '07-16-2020',
      coverageLevel: 'C',
      eligInd: true,
      showDetailsLink: false,
    },
  ];

  it('Should test failure flow of get Plan Type - 400 status', async () => {
    const memberDetails = memberMockResponse;
    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      );
    });
  });

  it('Should test failure flow of get Plan Type - 500 status', async () => {
    const memberDetails = memberMockResponse;
    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });
    mockedAxios.get.mockRejectedValue(
      createAxiosErrorForTest({
        errorObject: {},
        status: 500,
      }),
    );
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      screen.getByText(
        'There was a problem loading your information. Please try refreshing the page or returning to this page later.',
      );
    });
  });

  it('Should test success flow of PlanType - Medical HDHP plan with EPO', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        asOfDate: '11-18-2024',
        plans: planDetails,
      },
    });
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      screen.getByText('Medical HDHP plan with EPO');
    });
  });

  it('Should test success flow of PlanType - Medical HDHP plan', async () => {
    planDetails[0].planId = 'MBPEE001';
    mockedAxios.get.mockResolvedValue({
      data: {
        asOfDate: '11-18-2024',
        plans: planDetails,
      },
    });
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      screen.getByText('Medical HDHP plan');
    });
  });
  it('Should test success flow of PlanType - Medical PPO plan with EPO', async () => {
    planDetails[0].planId = 'GBPXE001';
    mockedAxios.get.mockResolvedValue({
      data: {
        asOfDate: '11-18-2024',
        plans: planDetails,
      },
    });
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      screen.getByText('Medical PPO plan with EPO');
    });
  });
  it('Should test success flow of PlanType - Medical PPO plan', async () => {
    planDetails[0].planId = 'MBPXE001';
    mockedAxios.get.mockResolvedValue({
      data: {
        asOfDate: '11-18-2024',
        plans: planDetails,
      },
    });
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      screen.getByText('Medical PPO plan');
    });
  });
  it('Should test success flow of PlanType Not available', async () => {
    planDetails[0].planId = 'XXXXXXXX';
    planDetails[0].planType = 'D';
    mockedAxios.get.mockResolvedValue({
      data: {
        asOfDate: '11-18-2024',
        plans: planDetails,
      },
    });
    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/memberservice/api/member/v1/members/byMemberCk/846239401/eligibility',
      );
      expect(screen.queryByText('Plan Type:')).not.toBeInTheDocument();
    });
  });
});
