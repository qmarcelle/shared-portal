'use server';

import { getLoggedInUserInfo } from '@/actions/loggedUserInfo';
import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { LoggedInMember } from '@/models/app/loggedin_member';
import { Member } from '@/models/member/api/loggedInUserInfo';
import { logger } from '@/utils/logger';
import { getServerSideUserId } from '@/utils/server_session';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';
import { createCOB } from './createCOB';
import { createInsuranceRequest } from './createInsuranceRequest';

export async function createOtherInsurance(
  insuranceRequest: OtherHealthInsuranceDetails,
  selectedMembers?: string[],
) {
  try {
    const session = await auth();
    const loggedInMember: LoggedInMember = await getLoggedInMember(session);
    const memberMemeck = (await loggedInMember).memeCk;

    const loggedUserInfo = await getLoggedInUserInfo(memberMemeck.toString());
    const members = loggedUserInfo.members;
    const otherHealthInsuranceRequest: OtherHealthInsuranceDetails[] = [];

    const membersToProcess: Member[] = insuranceRequest.forAllDependents
      ? members
      : members.filter((member) =>
          selectedMembers?.includes(member.firstName + ' ' + member.lastName),
        );

    // Iterate over the aggregated members list
    membersToProcess.forEach((member) => {
      if (insuranceRequest.noOtherInsurance) {
        if (loggedInMember.isMedical) {
          otherHealthInsuranceRequest.push(
            createInsuranceRequest(member, 'C', 'NOOTHER', insuranceRequest),
          );
        }
        if (loggedInMember.isDental) {
          otherHealthInsuranceRequest.push(
            createInsuranceRequest(member, 'D', 'NOOTHER', insuranceRequest),
          );
        }
        if (loggedInMember.lob === 'MEDC') {
          otherHealthInsuranceRequest.push(
            createInsuranceRequest(member, 'M', 'NOOTHER', insuranceRequest),
          );
        }
      } else {
        if (insuranceRequest.medicalBean?.otherInsuranceCompanyName) {
          otherHealthInsuranceRequest.push(
            createInsuranceRequest(
              member,
              'C',
              insuranceRequest.medicalBean.otherInsuranceCompanyName,
              insuranceRequest,
            ),
          );
        }
        if (insuranceRequest.dentalBean?.otherInsuranceCompanyName) {
          otherHealthInsuranceRequest.push(
            createInsuranceRequest(
              member,
              'D',
              insuranceRequest.dentalBean.otherInsuranceCompanyName,
              insuranceRequest,
            ),
          );
        }
        if (insuranceRequest.medicareBean?.otherInsuranceCompanyName) {
          otherHealthInsuranceRequest.push(
            createInsuranceRequest(
              member,
              'M',
              insuranceRequest.medicareBean.otherInsuranceCompanyName,
              insuranceRequest,
            ),
          );
        }
      }
    });

    /* if (
      insuranceRequest.noOtherInsurance &&
      insuranceRequest.forAllDependents
    ) {
      members.forEach((member) => {
        if (loggedInMember.isMedical) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.medicalBean!.otherInsuranceCompanyCode = 'NOOTHER';
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'C';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
        if (loggedInMember.isDental) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.dentalBean!.otherInsuranceCompanyCode = 'NOOTHER';
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'D';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
        if (loggedInMember.lob == 'MEDC') {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.medicareBean!.otherInsuranceCompanyCode = 'NOOTHER';
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'M';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
      });
    } else if (
      insuranceRequest.noOtherInsurance &&
      !insuranceRequest.forAllDependents
    ) {
      const selectedMembersData: Member[] = members.filter((member) => {
        selectedMembers?.includes(member.firstName + ' ' + member.lastName);
      });

      selectedMembersData.forEach((member) => {
        if (loggedInMember.isMedical) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.medicalBean!.otherInsuranceCompanyCode = 'NOOTHER';
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'C';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
        if (loggedInMember.isDental) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.dentalBean!.otherInsuranceCompanyCode = 'NOOTHER';
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'D';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
        if (loggedInMember.lob == 'MEDC') {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.medicareBean!.otherInsuranceCompanyCode = 'NOOTHER';
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'M';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
      });
    } else if (
      !insuranceRequest.noOtherInsurance &&
      insuranceRequest.forAllDependents
    ) {
      members.forEach((member) => {
        if (insuranceRequest.medicalBean?.otherInsuranceCompanyName) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'C';
          otherHealthInsuranceRequest.push(insuranceRequest);
        } else if (insuranceRequest.dentalBean?.otherInsuranceCompanyName) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'D';
          otherHealthInsuranceRequest.push(insuranceRequest);
        } else if (insuranceRequest.medicareBean?.otherInsuranceCompanyName) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'M';
          otherHealthInsuranceRequest.push(insuranceRequest);
        } else if (
          insuranceRequest.medicalBean?.otherInsuranceCompanyName &&
          insuranceRequest.dentalBean?.otherInsuranceCompanyName
        ) {
          insuranceRequest.memeCK = member.memberCk.toString();
          insuranceRequest.memberName =
            member.firstName + ' ' + member.lastName;
          insuranceRequest.dob = member.birthDate;
          insuranceRequest.insuranceType = 'C';
          otherHealthInsuranceRequest.push(insuranceRequest);
        }
      });
    } */

    const userId = await getServerSideUserId();

    const updateCOBResponse = await createCOB(
      otherHealthInsuranceRequest,
      loggedInMember,
      userId,
    );

    return updateCOBResponse;
  } catch (error) {
    logger.error('Error Response from create OtherInsurance API', error);
    throw error;
  }
}
