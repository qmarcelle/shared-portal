'use server';

import { portalSvcsApi } from '@/utils/api/portalApi';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { LoggedInUserInfo, Member } from '@/models/member/api/loggedInUserInfo';
import { getDateTwoYearsAgo } from '@/utils/api/date';
import { DocumentListMockResp } from '../mock/documentListMockResp';
import { GetDocumentMockResp } from '../mock/getDocumentMockResp';
import {
  IDocumentFile,
  IDocumentMetadataListResponse,
} from '../models/api/document';

export async function getDocumentsList(): Promise<
  ActionResponse<number, IDocumentMetadataListResponse>
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
    const response = await portalSvcsApi.get<IDocumentMetadataListResponse>(
      `/${process.env.DOCUMENTSERVICE_CONTEXT_ROOT}?memberId=${memberIdsUrl}&groupId=${groupId}&fromDate=${fromDate}`,
    );

    return {
      status: 200,
      data: response.data,
    };
  } catch (err) {
    return {
      status: 400,
      data: DocumentListMockResp,
    };
  }
}

export async function getDocumentFileInfo(
  documentId: string,
  taskSequenceNumber: string,
): Promise<ActionResponse<number, IDocumentFile>> {
  try {
    const response = await portalSvcsApi.get<IDocumentFile>(
      `/${process.env.DOCUMENTSERVICE_CONTEXT_ROOT}:${documentId}?taskSequenceNumber=${taskSequenceNumber}`,
    );

    return {
      status: 200,
      data: response.data,
    };
  } catch (err) {
    return {
      status: 400,
      data: GetDocumentMockResp,
    };
  }
}
