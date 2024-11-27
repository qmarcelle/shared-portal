import { Member, PlanDetail } from '@/models/member/api/loggedInUserInfo';
import { capitalizeName } from '@/utils/capitalizeName';
import { logger } from '@/utils/logger';
import {
  ALL_BENEFIT_TYPE,
  DENTAL_BENEFIT_TYPE,
  MEDICAL_BENEFIT_TYPE,
  OTHER_BENEFIT_TYPE,
  RX_BENEFIT_TYPE,
  VISION_BENEFIT_TYPE,
} from '../models/benefitConsts';

export const getMemberDropdownValues = (members: Member[]) => {
  logger.info('Mapping members to dropdown values');
  let i: number = 0;
  return members.map((member) => ({
    label: `${capitalizeName(member.firstName)} ${capitalizeName(member.lastName)}`,
    value: member.memberCk.toString(),
    id: '' + i++,
  }));
};

export interface BenefitDropdownItem {
  label: string;
  value: string;
  id: string;
}

export const getBenefitTypes = (planDetails: PlanDetail[]) => {
  const sortedPlanDetails = planDetails.sort((a, b) => {
    const order = [
      MEDICAL_BENEFIT_TYPE,
      DENTAL_BENEFIT_TYPE,
      VISION_BENEFIT_TYPE,
      OTHER_BENEFIT_TYPE,
    ];
    return order.indexOf(a.productCategory) - order.indexOf(b.productCategory);
  });
  const items: BenefitDropdownItem[] = [];
  let id = 0;
  items.push({ label: 'All Types', value: ALL_BENEFIT_TYPE, id: '0' });
  sortedPlanDetails.forEach((plan) => {
    id++;
    switch (plan.productCategory) {
      case MEDICAL_BENEFIT_TYPE:
        items.push({
          label: 'Medical',
          value: MEDICAL_BENEFIT_TYPE,
          id: id.toString(),
        });
        id++;
        items.push({
          label: 'Pharmacy',
          value: RX_BENEFIT_TYPE,
          id: id.toString(),
        });
        break;
      case DENTAL_BENEFIT_TYPE:
        items.push({
          label: 'Dental',
          value: DENTAL_BENEFIT_TYPE,
          id: id.toString(),
        });
        break;
      case VISION_BENEFIT_TYPE:
        items.push({
          label: 'Vision',
          value: VISION_BENEFIT_TYPE,
          id: id.toString(),
        });
        break;
      default:
        break;
    }
  });
  items.push({
    label: 'Other',
    value: OTHER_BENEFIT_TYPE,
    id: id.toString(),
  });

  return items;
};
