import { MemberBenefitsBean } from '../models/member_benefits_bean';
import { PlanDetailsInfo } from './loadBenefits';
import { DentalBenefitsStub } from './stubs/DEHCNY02Benefits';
import { MedicalBenefitsStub } from './stubs/MBPX0806Benefits';

export default async function getStubbedBenefits(
  memberCk: number,
  listOfPlansToQuery: PlanDetailsInfo[],
) {
  const benefitsData: MemberBenefitsBean = { memberCk: memberCk };
  for (const plan of listOfPlansToQuery) {
    if (plan.planID == 'MBPX0806')
      benefitsData.medicalBenefits = MedicalBenefitsStub;
    if (plan.planID == 'DEHCNY02')
      benefitsData.dentalBenefits = DentalBenefitsStub;
  }
  return benefitsData;
}
