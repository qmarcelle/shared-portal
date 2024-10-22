import MemberIdCardPage from '@/app/memberIDCard/page';
import { CardType } from '@/app/myPlan/model/api/card_type';
import { ExtensionType } from '@/app/myPlan/model/api/extension_type';
import { memberMockResponse } from '@/mock/memberMockResponse';
import { mockedAxios } from '@/tests/__mocks__/axios';
import { createAxiosErrorForTest } from '@/tests/test_utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';

const setupUI = async () => {
  const Result = await MemberIdCardPage();
  render(Result);
};

describe('Member ID Card ', () => {
  test('Member ID Card SVG Image Front and Back for Member Relation - M', async () => {
    const memberDetails = memberMockResponse;
    mockedAxios.get.mockResolvedValue({
      data: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.0//EN'
          'http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd'>`,
    });

    await setupUI();
    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeBack}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });

  test('Member ID Card SVG Image API integration null scenario', async () => {
    const memberDetails = memberMockResponse;
    mockedAxios.get.mockResolvedValue({
      data: null,
    });

    await setupUI();

    await waitFor(() => {
      const responseFront = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      const responseBack = expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeBack}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(responseFront).toBeNull;
      expect(responseBack).toBeNull;
    });
  });

  test('Member ID Card SVG Image integration API  400 bad request scenario', async () => {
    const memberDetails = memberMockResponse;
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
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeBack}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      //expect(response).not.toBeInTheDocument;
      expect(
        screen.getAllByText(
          'There was a problem loading your ID Card. Try refreshing the page or returning to this page later.',
        ).length,
      ).toBe(5);
    });
  });

  test('Member ID Card SVG Image Front and Back for Member Relation - S', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.memberRelation = 'S';
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
        `/IDCardService/Image?memberCk=${memberDetails.member_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?memberCk=${memberDetails.member_ck}&cardType=${CardType.CardTypeBack}&groupId=${memberDetails.groupID}&effectiveDate=${new Date().toLocaleDateString()}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });

  test('Member ID Card SVG Image Front and Back for Future effective members', async () => {
    const memberDetails = memberMockResponse;
    memberDetails.futureEffective = true;
    memberDetails.memberRelation = 'M';
    const today = new Date();
    today.setMonth(today.getMonth() + 2);
    memberDetails.effectiveStartDate = today.toLocaleDateString();

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
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeFront}&groupId=${memberDetails.groupID}&effectiveDate=${memberDetails.effectiveStartDate}&fileExtension=${ExtensionType.Svg}`,
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `/IDCardService/Image?subscriberCk=${memberDetails.subscriber_ck}&cardType=${CardType.CardTypeBack}&groupId=${memberDetails.groupID}&effectiveDate=${memberDetails.effectiveStartDate}&fileExtension=${ExtensionType.Svg}`,
      );
    });
  });
});
