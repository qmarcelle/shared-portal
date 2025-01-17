import { Member, PlanDetail } from '@/models/member/api/loggedInUserInfo';
import { capitalizeName } from '@/utils/capitalizeName';
import { logger } from '@/utils/logger';
import { BenefitType } from '../models/benefitConsts';

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
      BenefitType.MEDICAL.toString(),
      BenefitType.DENTAL.toString(),
      BenefitType.VISION.toString(),
      BenefitType.OTHER.toString(),
    ];
    return order.indexOf(a.productCategory) - order.indexOf(b.productCategory);
  });
  const items: BenefitDropdownItem[] = [];
  let id = 0;
  items.push({ label: 'All Types', value: BenefitType.ALL, id: '0' });
  sortedPlanDetails.forEach((plan) => {
    id++;
    switch (plan.productCategory) {
      case BenefitType.MEDICAL:
        items.push({
          label: 'Medical',
          value: BenefitType.MEDICAL,
          id: id.toString(),
        });
        id++;
        items.push({
          label: 'Pharmacy',
          value: BenefitType.RX,
          id: id.toString(),
        });
        break;
      case BenefitType.DENTAL:
        items.push({
          label: 'Dental',
          value: BenefitType.DENTAL,
          id: id.toString(),
        });
        break;
      case BenefitType.VISION:
        items.push({
          label: 'Vision',
          value: BenefitType.VISION,
          id: id.toString(),
        });
        break;
      default:
        break;
    }
  });
  items.push({
    label: 'Other',
    value: BenefitType.OTHER,
    id: id.toString(),
  });

  return items;
};
