'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/auth';
import { ESResponse } from '@/models/enterprise/esResponse';
import { LoggedInUserInfo, Member } from '@/models/member/api/loggedInUserInfo';
import { getDateTwoYearsAgo } from '@/utils/api/date';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { DocumentListMockResp } from '../mock/documentListMockResp';
import { GetDocumentMockResp } from '../mock/getDocumentMockResp';
import {
  IDocumentFile,
  IDocumentMetadataListResponse,
} from '../models/api/document';

export async function getDocumentsList(): Promise<
  ESResponse<IDocumentMetadataListResponse>
> {
  try {
    const fromDate: string = getDateTwoYearsAgo();
    const session = await auth();
    const loggedInMemberInfoReq = await getLoggedInUserInfo(
      session!.user.currUsr!.plan!.memCk,
    );

    const loggedInMemberInfo: LoggedInUserInfo = loggedInMemberInfoReq;
    const groupId: string = loggedInMemberInfo.groupData.groupID;
    const ids: string[] = loggedInMemberInfo.members.map((member: Member) => {
      return `${loggedInMemberInfo.subscriberID}0${member.memberSuffix}`;
    });
    const memberIdsUrl: string = ids.map((id: string) => `${id}`).join('|');
    const response = await esApi.get<IDocumentMetadataListResponse>(
      `/${process.env.DOCUMENTSERVICE_CONTEXT_ROOT}?memberId=${memberIdsUrl}&groupId=${groupId}&fromDate=${fromDate}`,
    );
    logger.info('DocumentsList Status Api Response', response);
    return {
      data: response.data,
    };
  } catch (err) {
    return {
      data: DocumentListMockResp,
    };
  }
}

export async function getDocumentFileInfo(
  documentId: string,
  taskSequenceNumber: string,
): Promise<ESResponse<IDocumentFile>> {
  try {
    const response = await esApi.get<IDocumentFile>(
      `/${process.env.DOCUMENTSERVICE_CONTEXT_ROOT}:${documentId}?taskSequenceNumber=${taskSequenceNumber}`,
    );
    logger.info('DocumentsFile Status Api Response', response);
    return {
      data: response.data,
    };
  } catch (err) {
    return {
      data: GetDocumentMockResp,
    };
  }
}
