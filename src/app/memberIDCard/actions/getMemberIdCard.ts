'use server';

import { getMemberDetails } from '@/actions/memberDetails';
import { invokeIDCardData } from '@/app/myPlan/actions/idCardImageSVG';
import { CardType } from '@/app/myPlan/model/api/card_type';
import { ExtensionType } from '@/app/myPlan/model/api/extension_type';
import { ActionResponse } from '@/models/app/actionResponse';
import { IdCardData } from '../model/app/idCardData';

export const getMemberIdCardData = async (): Promise<
  ActionResponse<number, IdCardData>
> => {
  try {
    const [idCardFrontSvgData, idCardBackSvgData] = await Promise.allSettled([
      invokeIDCardData(CardType.CardTypeFront, ExtensionType.Svg),
      invokeIDCardData(CardType.CardTypeBack, ExtensionType.Svg),
    ]);
    const memberDetails = await getMemberDetails();

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
          first_name: memberDetails.first_name,
          last_name: memberDetails.last_name,
          memberRelation: memberDetails.memberRelation,
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
