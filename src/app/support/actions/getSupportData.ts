'use server';

//import { getMemberDetails } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { SupportData } from '../model/app/support_data';
import { getDigitalId } from './getDigitalId';

export const getSupportData = async (): Promise<
  ActionResponse<number, SupportData>
> => {
  let session;
  try {
    session = await auth();
    //const memberDetails = await getMemberDetails();
    let digitalIdResponse;
    if (
      session?.user.currUsr?.plan.grpId &&
      session?.user.currUsr?.plan.memCk
    ) {
      digitalIdResponse = await getDigitalId(
        session?.user.currUsr?.plan.grpId,
        session?.user.currUsr?.plan.memCk,
      );
    }

    return {
      status: 200,
      data: {
        memberDetails: {
          groupId: session?.user.currUsr?.plan.grpId ?? '',
          digitalId: digitalIdResponse?.data?.hashCode ?? '',
        },
      },
    };
  } catch (error) {
    return {
      status: 400,
      data: {
        memberDetails: {
          groupId: session?.user.currUsr?.plan.grpId ?? '',
          digitalId: '',
        },
      },
    };
  }
};
