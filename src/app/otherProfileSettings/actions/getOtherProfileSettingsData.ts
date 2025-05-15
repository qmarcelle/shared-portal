'use server';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';

import { OtherProfileSettingsData } from '../model/api/otherProfileSettingsData';
import {
  getHealthEquityPossibleAnswers,
  getHealthEquitySelectedAnswers,
} from './getNCQAInfo';

export const getOtherProfileSettingsData = async (): Promise<
  ActionResponse<number, OtherProfileSettingsData>
> => {
  const session = await auth();
  try {
    const healthEquityPossibleAnswers = await getHealthEquityPossibleAnswers();
    const healthEquitySelectedAnswers =
      await getHealthEquitySelectedAnswers(session);

    return {
      status: 200,
      data: {
        healthEquityPossibleAnswersData: healthEquityPossibleAnswers,
        healthEquitySelectedAnswersData: healthEquitySelectedAnswers,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        healthEquityPossibleAnswersData: null,
        healthEquitySelectedAnswersData: null,
      },
    };
  }
};
