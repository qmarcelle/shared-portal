'use server';

import { ActionResponse } from '@/models/app/actionResponse';

import {
  invokeEmailAction,
  invokePhoneNumberAction,
} from '@/app/(protected)/(common)/member/profileSettings/actions/profileSettingsAction';
import { auth } from '@/app/(system)/auth';
import { EmailAppData } from '../models/email_app_data';
import { invokeFamilyMemberDetailsAction } from './sendEmailAction';

export const getEmailData = async (): Promise<
  ActionResponse<number, EmailAppData>
> => {
  try {
    const session = await auth();
    const famillyMembers = await invokeFamilyMemberDetailsAction(
      `${session?.user.currUsr?.plan!.memCk}`,
    );
    const emailData = await invokeEmailAction();
    const phoneData = await invokePhoneNumberAction();
    return {
      status: 200,
      data: {
        email: emailData,
        phone: phoneData,
        memberDetails: famillyMembers,
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        email: '',
        phone: '',
        memberDetails: [{ fullName: '', memberCK: '' }],
      },
    };
  }
};
