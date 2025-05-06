'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { invokeIDCardData } from '@/app/(protected)/(common)/member/myplan/actions/idCardImageSVG';
import { CardType } from '@/app/(protected)/(common)/member/myplan/model/api/card_type';
import { ExtensionType } from '@/app/(protected)/(common)/member/myplan/model/api/extension_type';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { IdCardData } from '../model/app/idCardData';

export const getMemberIdCardData = async (): Promise<
  ActionResponse<number, IdCardData>
> => {
  try {
    const session = await auth();
    const memberDetails = await getLoggedInMember(session);

    const [idCardFrontSvgData, idCardBackSvgData] = await Promise.allSettled([
      invokeIDCardData(
        CardType.CardTypeFront,
        ExtensionType.Svg,
        memberDetails,
        session,
      ),
      invokeIDCardData(
        CardType.CardTypeBack,
        ExtensionType.Svg,
        memberDetails,
        session,
      ),
    ]);

    return {
      status: 200,
      data: {
        idCardSvgFrontData:
          idCardFrontSvgData.status == 'fulfilled'
            ? idCardFrontSvgData.value
            : null,
        idCardSvgBackData:
          idCardBackSvgData.status == 'fulfilled'
            ? idCardBackSvgData.value
            : null,
        memberDetails: {
          first_name: memberDetails.firstName,
          last_name: memberDetails.lastName,
          memberRelation: memberDetails.memRelation,
          noOfDependents: memberDetails.noOfDependents,
          contact: memberDetails.contact,
        },
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        idCardSvgFrontData: null,
        idCardSvgBackData: null,
        memberDetails: null,
      },
    };
  }
};
