'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { CardType } from '../model/api/card_type';
import { ExtensionType } from '../model/api/extension_type';
import { MyPlanData } from '../model/app/myPlanData';
import { invokeIDCardData } from './idCardImageSVG';
import { auth } from '@/auth';

export const getMyPlanData = async (): Promise<
  ActionResponse<number, MyPlanData>
> => {
  const session = await auth();
  try {
    const idCardSvgData = await invokeIDCardData(
      CardType.CardTypeFront,
      ExtensionType.Svg,
    );
    return {
      status: 200,
      data: {
        idCardSvgFrontData: idCardSvgData,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        idCardSvgFrontData: null,
        visibilityRules: session?.user.vRules,
      },
    };
  }
};
