'use server';

import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { portalSvcsApi } from '@/utils/api/portalApi';
import { logger } from '@/utils/logger';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';

export async function getOtherInsurance(
  loggedUserInfo: LoggedInUserInfo,
): Promise<OtherHealthInsuranceDetails[] | null> {
  try {
    //let otherInsuranceResponse;

    const meme_cks: number[] = [];
    const members = loggedUserInfo.members;

    members.forEach((member) => {
      meme_cks.push(member.memberCk);
    });

    const membersInfo = members.map((member) => {
      return {
        memeck: member.memberCk,
        name: member.firstName + ' ' + member.lastName,
        dob: member.birthDate,
      };
    });

    const memeCKString = meme_cks.join(',');

    //const userId = await getServerSideUserId();
    console.log('memecklist' + memeCKString);

    const groupType = loggedUserInfo.lob;
    let isMedAdv = false;
    const isMed = groupType != null && groupType === 'MEDC';
    isMedAdv = isMedAdv || isMed;

    // eslint-disable-next-line prefer-const
    const otherInsuranceResponse = await portalSvcsApi.get<
      OtherHealthInsuranceDetails[]
    >(
      `/memberservice/api/COBService?memeCKs=${memeCKString}&isMedAdv=${isMedAdv}`,
    );

    otherInsuranceResponse.data.forEach((item) => {
      const member = membersInfo.find(
        (member) => member.memeck.toString() === item.memeCK,
      );
      item.memberName = member?.name;
      item.dob = member?.dob;
    });

    return membersInfo.map((member) => {
      const otherInsuranceItem = otherInsuranceResponse.data.find(
        (otherInsurance) => otherInsurance.memeCK === member.memeck.toString(),
      );
      if (otherInsuranceItem != null) {
        otherInsuranceItem.memberName = member.name;
        otherInsuranceItem.dob = member.dob;
        return otherInsuranceItem;
      } else {
        return {
          memberName: member.name,
          dob: member.dob,
        };
      }
    });
  } catch (error) {
    logger.error('Error Response from GetOtherInsurance API', error);
    throw error;
  }
}
