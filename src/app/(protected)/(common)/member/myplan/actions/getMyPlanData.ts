'use server';

import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { CardType } from '../model/api/card_type';
import { ExtensionType } from '../model/api/extension_type';
import { MyPlanData } from '../model/app/myPlanData';
import { invokeIDCardData } from './idCardImageSVG';
import { getPlanTypeData } from './planTypeData';

export const getMyPlanData = async (): Promise<
  ActionResponse<number, MyPlanData>
> => {
  const session = await auth();
  try {
    const memberDetails = await getLoggedInMember(session);
    const [idCardSvgFrontData, planType] = await Promise.allSettled([
      invokeIDCardData(
        CardType.CardTypeFront,
        ExtensionType.Svg,
        memberDetails,
        session,
      ),
      getPlanTypeData(),
    ]);
    return {
      status: 200,
      data: {
        idCardSvgFrontData:
          idCardSvgFrontData.status == 'fulfilled'
            ? idCardSvgFrontData.value
            : null,
        planType: planType.status == 'fulfilled' ? planType.value : null,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        idCardSvgFrontData: null,
        planType: null,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
