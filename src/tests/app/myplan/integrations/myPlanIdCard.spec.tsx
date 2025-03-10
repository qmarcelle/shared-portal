import { CardType } from '@/app/myPlan/model/api/card_type';
import { ExtensionType } from '@/app/myPlan/model/api/extension_type';
import MyPlanPage from '@/app/myPlan/page';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MyPlanPage();
  render(Result);
};

jest.mock('../../../../auth', () => ({
  auth: jest.fn(() =>
    Promise.resolve({
      user: {
        currUsr: {
          firstName: 'Chris',
          plan: {
            planName: 'BlueCross BlueShield of Tennessee',
            subId: '123456',
            grpId: '100000',
            memCk: '91722407',
            sbsbCk: '91722400',
            coverageType: ['Medical', 'Dental', 'Vision'],
          },
        },
        vRules: {
          futureEffective: false,
          fsaOnly: false,
          wellnessOnly: false,
          terminated: false,
          katieBeckNoBenefitsElig: false,
          blueCare: false,
        },
      },
    }),
  ),
}));

describe('ID Card SVG Image Front', () => {
  beforeEach(() => {
    mockedAxios.get.mockResolvedValueOnce({ data: loggedInUserInfoMockResp });
  });
  test('ID Card SVG Image Front for Member Relation - M', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });

  test('ID Card SVG Image API integration null scenario', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: null,
    });

    await setupUI();

    await waitFor(() => {
      const response = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(response).toBeNull;
    });
  });

  test('ID Card SVG Image integration API  400 bad request scenario', async () => {
    mockedAxios.get.mockRejectedValueOnce(
      createAxiosErrorForTest({
        errorObject: {},
        status: 400,
      }),
    );

    await setupUI();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      //expect(response).not.toBeInTheDocument;
      expect(
        screen.getByText('Your ID card is not available at this time.'),
      ).toBeVisible();
    });
  });

  test('ID Card SVG Image Front for Future effective members', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.members[4].planDetails[1].effectiveDate = 253370782800000;
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });

    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
            'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalled();
    });
  });

  xit('ID Card SVG Image Front for Member Relation - S', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.memberRelation = 'S';
    mockedAxios.get.mockResolvedValueOnce({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });
    jest.mock('../../../../actions/memberDetails', () => ({
      getMemberDetails: jest.fn(() => Promise.resolve(memberDetails)),
    }));

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?memberCk=${memberDetails.member_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });
});
