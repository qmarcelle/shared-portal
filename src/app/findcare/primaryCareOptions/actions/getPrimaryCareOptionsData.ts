'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { PrimaryCareOptionsData } from '../model/app/primary_care_options_data';
import { getPCPInfo } from './getPCPInfo';

export const getPrimaryCareOptionsData = async (): Promise<
  ActionResponse<number, PrimaryCareOptionsData>
> => {
  try {
    const pcpPhysician = await getPCPInfo();
    return {
      status: 200,
      data: {
        primaryCareProvider: pcpPhysician,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        primaryCareProvider: null,
      },
    };
  }
};
