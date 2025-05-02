import { Member } from '@/models/member/api/loggedInUserInfo';
import { OtherHealthInsuranceDetails } from '../models/api/otherhealthinsurance_details';

const beanMap: Record<string, string> = {
  C: 'medicalBean',
  D: 'dentalBean',
  M: 'medicareBean',
};

export const createInsuranceRequest = (
  member: Member,
  insuranceType: string,
  companyCode: string,
  insuranceRequest: OtherHealthInsuranceDetails,
): OtherHealthInsuranceDetails => {
  const beanVarName: string = beanMap[insuranceType];
  const otherInsuranceCompanyName =
    insuranceRequest[beanVarName as keyof OtherHealthInsuranceDetails]
      ?.otherInsuranceCompanyName || companyCode;

  return {
    ...insuranceRequest,
    memeCK: member.memberCk.toString(),
    memberName: `${member.firstName} ${member.lastName}`,
    dob: member.birthDate,
    insuranceType,
    ...(beanVarName && {
      [beanVarName]: {
        ...insuranceRequest[beanVarName as keyof OtherHealthInsuranceDetails],
        otherInsuranceCompanyCode: companyCode,
        otherInsuranceCompanyName,
      },
    }),
  };
};
