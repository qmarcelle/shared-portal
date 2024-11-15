'use server';

import { ActionResponse } from '@/models/app/actionResponse';
import { EmailAppData } from '../models/emalAppData';

import {
  invokeEmailAction,
  invokeFamilyMemberDetailsAction,
  invokePhoneNumberAction,
} from './sendEmailAction';

export const getEmailData = async (): Promise<
  ActionResponse<number, EmailAppData>
> => {
  try {
    const famillyMembers = await invokeFamilyMemberDetailsAction('640334551');
    const emailData = await invokeEmailAction();
    const phoneData = await invokePhoneNumberAction();
    /** 
    const membersInfo: MemberDetails[] = [];
    famillyMembers.forEach((element) => {
      membersInfo.push({
        fullName: element.firstName + ' ' + element.lastName,
        memberCK: element.memberCk + '',
      });
    });
*/
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
