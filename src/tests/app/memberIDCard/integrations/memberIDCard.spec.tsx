import MemberIdCardPage from '@/app/memberIDCard/page';
import { CardType } from '@/app/myPlan/model/api/card_type';
import { ExtensionType } from '@/app/myPlan/model/api/extension_type';
import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { mockedFetch } from '@/tests/setup';
import { createAxiosErrorForTest, fetchRespWrapper } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MemberIdCardPage();
  render(Result);
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
        },
      },
    }),
  ),
}));

describe('Member ID Card ', () => {
  beforeEach(() => {
    mockedFetch.mockResolvedValueOnce(
      fetchRespWrapper(loggedInUserInfoMockResp),
    );
  });
  test('Member ID Card SVG Image Front and Back for Member Relation - M', async () => {
    mockedAxios.get.mockResolvedValue({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeBack}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });

  test('Member ID Card SVG Image API integration null scenario', async () => {
    mockedAxios.get.mockResolvedValue({
      data: null,
    });

    await setupUI();

    await waitFor(() => {
      const responseFront = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      const responseBack = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeBack}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(responseFront).toBeNull;
      expect(responseBack).toBeNull;
    });
  });

  test('Member ID Card SVG Image integration API  400 bad request scenario', async () => {
    mockedAxios.get.mockRejectedValue(
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
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeBack}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      //expect(response).not.toBeInTheDocument;
      expect(
        screen.getAllByText(
          'There was a problem loading your ID Card. Try refreshing the page or returning to this page later.',
        ).length,
      ).toBe(5);
    });
  });

  test('Member ID Card SVG Image Front and Back for Future effective members', async () => {
    const memberDetails = loggedInUserInfoMockResp;
    memberDetails.members[4].planDetails[1].effectiveDate = 253370782800000;
    mockedAxios.get.mockResolvedValueOnce({ data: memberDetails });
    mockedAxios.get.mockResolvedValue({
      data: `<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
            'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=1/1/9999&fileExtension=${ExtensionType.Svg}`,
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?subscriberCk=91722400&cardType=${CardType.CardTypeBack}&groupId=100000&effectiveDate=1/1/9999&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });

  xit('Member ID Card SVG Image Front and Back for Member Relation - S', async () => {
    const memberDetails = loggedInUserInfoMockResp;

    mockedAxios.get.mockResolvedValue({
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
        `/Image?memberCk=91722407&cardType=${CardType.CardTypeFront}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/Image?memberCk=91722407&cardType=${CardType.CardTypeBack}&groupId=100000&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });
});
