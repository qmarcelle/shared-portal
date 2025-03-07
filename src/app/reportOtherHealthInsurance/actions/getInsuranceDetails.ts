'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { OtherInsuranceData } from '../models/app/other_insurance_data';
import { getOtherInsurance } from './getOtherInsurance';

export const getOtherInsuranceData = async (
  loggedUserInfo: LoggedInUserInfo,
): Promise<ActionResponse<number, OtherInsuranceData>> => {
  try {
    const otherInsuranceDetails = await getOtherInsurance(loggedUserInfo);
    return {
      status: 200,
      data: {
        cobList: otherInsuranceDetails,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        cobList: null,
      },
    };
  }
};
