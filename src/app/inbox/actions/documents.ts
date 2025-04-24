'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { LoggedInUserInfo, Member } from '@/models/member/api/loggedInUserInfo';
import { getDateTwoYearsAgo } from '@/utils/api/date';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { formatMemberId } from '@/utils/member_utils';
import {
  IDocumentFile,
  IDocumentMetadataListResponse,
} from '../models/api/document';

export async function getDocumentsList(): Promise<IDocumentMetadataListResponse> {
  try {
    const fromDate: string = getDateTwoYearsAgo();
    const session = await auth();
    const loggedInMemberInfoReq = await getLoggedInUserInfo(
      session!.user.currUsr!.plan!.memCk,
    );

    const loggedInMemberInfo: LoggedInUserInfo = loggedInMemberInfoReq;
    const groupId: string = loggedInMemberInfo.groupData.groupID;
    const ids: string[] = loggedInMemberInfo.members.map((member: Member) => {
      return formatMemberId(
        loggedInMemberInfo.subscriberID,
        member.memberSuffix,
      );
    });

    const memberIdsUrl: string = ids.map((id: string) => `${id}`).join('|');
    const response = await esApi.get(
      `/${process.env.DOCUMENTSERVICE_CONTEXT_ROOT}?memberId=${memberIdsUrl}&groupId=${groupId}&fromDate=${fromDate}`,
    );
    logger.info('DocumentsList Status Api Response', response.data);
    return response?.data?.data;
  } catch (err) {
    logger.error('Error in document center - getDocumentsList ', err);
    throw err;
  }
}

export async function getDocumentFileInfo(
  documentId: string,
  taskSequenceNumber: string,
): Promise<IDocumentFile> {
  try {
    const response = await esApi.get(
      `/${process.env.DOCUMENTSERVICE_CONTEXT_ROOT}/${documentId}?taskSequenceNumber=${taskSequenceNumber}`,
    );
    return response?.data?.data;
  } catch (err) {
    logger.error('Error in document center - getDocumentFileInfo ', err);
    throw err;
  }
}
