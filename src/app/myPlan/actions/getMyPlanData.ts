'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { CardType } from '../model/api/card_type';
import { ExtensionType } from '../model/api/extension_type';
import { MyPlanData } from '../model/app/myPlanData';
import { invokeIDCardData } from './idCardImageSVG';

export const getMyPlanData = async (): Promise<
  ActionResponse<number, MyPlanData>
> => {
  try {
    const idCardSvgData = await invokeIDCardData(
      CardType.CardTypeFront,
      ExtensionType.Svg,
    );
    return { status: 200, data: { idCardSvgFrontData: idCardSvgData } };
  } catch (error) {
    return { status: 400, data: { idCardSvgFrontData: null } };
  }
};
