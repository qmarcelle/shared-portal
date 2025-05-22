'use server';

import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import { memberService } from '@/utils/api/memberService';
import { logger } from '@/utils/logger';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';
import { OtherInsuranceData } from '../models/app/other_insurance_data';

export async function getOtherInsurance(
  loggedUserInfo: LoggedInUserInfo,
): Promise<OtherHealthInsuranceDetails[] | null> {
  try {
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
    const otherInsuranceResponse = await memberService.get<OtherInsuranceData>(
      `/api/COBService?memeCKs=${memeCKString}&isMedAdv=${isMedAdv}`,
    );

    if (otherInsuranceResponse.data!.cobList != null) {
      const otherInsuranceForAll = otherInsuranceResponse.data!.cobList.map(
        (otherInsuranceItem) => {
          return otherInsuranceItem.forAllDependents;
        },
      );

      let otherInsuranceForAllMembers = {};

      if (otherInsuranceForAll[0] == true) {
        otherInsuranceResponse.data.cobList?.map((otherInsuranceItem) => {
          otherInsuranceForAllMembers = otherInsuranceItem;
        });
        return membersInfo.map((member) => {
          return {
            ...otherInsuranceForAllMembers,
            memberName: member.name,
            dob: member.dob,
          };
        });
      } else {
        return membersInfo.map((member) => {
          const otherInsuranceItem = otherInsuranceResponse.data.cobList?.find(
            (otherInsurance) =>
              otherInsurance.memeCK === member.memeck.toString(),
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
      }
    } else {
      return membersInfo.map((member) => {
        return {
          memberName: member.name,
          dob: member.dob,
        };
      });
    }
  } catch (error) {
    logger.error('Error Response from GetOtherInsurance API', error);
    return null;
  }
}
