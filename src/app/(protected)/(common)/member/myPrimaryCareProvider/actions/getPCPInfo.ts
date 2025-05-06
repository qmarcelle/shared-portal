'use server';

import { getPCPInfo } from '@/app/(protected)/(common)/member/findcare/primaryCareOptions/actions/pcpInfo';
import { PrimaryCareProviderDetails } from '@/app/(protected)/(common)/member/findcare/primaryCareOptions/model/api/primary_care_provider';
import { auth } from '@/app/(system)/auth';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { pcpService } from '@/utils/api/pcpService';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';

export async function getPCPProviderInfo(
  loggedUserInfo: LoggedInUserInfo,
  session?: Session | null,
): Promise<PrimaryCareProviderDetails> {
  try {
    const response = await getPCPInfo(session);
    if (loggedUserInfo != null && loggedUserInfo.members != null) {
      const loggedMember = loggedUserInfo.members.find(
        (x) => x.memRelation == 'M',
      );
      if (loggedMember != null && response != null) {
        response.name = loggedMember.firstName + ' ' + loggedMember.lastName;
        response.dob = loggedMember.birthDate;
      }
    }
    return response;
  } catch (error) {
    logger.error('Error Response from GetPCPInfo API', error);
    throw error;
  }
}

export async function getDependentPCPInfo(
  loggedUserInfo: LoggedInUserInfo,
  session?: Session | null,
): Promise<(PrimaryCareProviderDetails | null)[]> {
  try {
    const memberDetails = session ?? (await auth());

    const responsePromises = loggedUserInfo.members
      .filter(
        (item) =>
          Number(memberDetails?.user.currUsr?.plan?.memCk) != item.memberCk,
      )
      .map((member) => {
        console.log('Inside Map', member.memberCk);
        return pcpService.get<PrimaryCareProviderDetails>(
          `/pcPhysician/${member.memberCk}`,
        );
      });

    const membersInfo = loggedUserInfo.members
      .filter(
        (item) =>
          Number(memberDetails?.user.currUsr?.plan?.memCk) != item.memberCk,
      )
      .map((member) => {
        return {
          name: member.firstName + ' ' + member.lastName,
          dob: member.birthDate,
        };
      });

    const result = await Promise.all(responsePromises);
    const responseMain = result.map((item, index) => {
      return item?.data
        ? {
            physicianName: item.data.physicianName ?? '',
            physicianId: item.data.physicianId ?? '',
            address1: item.data.address1 ?? '',
            address2: item.data.address2 ?? '',
            address3: item.data.address3 ?? '',
            addressType: item.data.addressType ?? '',
            zip: item.data.zip ?? '',
            city: item.data.city ?? '',
            state: item.data.state ?? '',
            phone: item.data.phone ?? '',
            ext: item.data.ext ?? '',
            taxId: item.data.taxId ?? '',
            name: membersInfo[index].name ?? '',
            dob: membersInfo[index].dob ?? '',
          }
        : null;
    });
    return responseMain;
  } catch (error) {
    console.error('Error Response from GetPCPInfo API', error);
    throw error;
  }
}
