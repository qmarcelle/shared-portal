import { Member, PlanDetail } from '@/models/member/api/loggedInUserInfo';
import { capitalizeName } from '@/utils/capitalizeName';
import { logger } from '@/utils/logger';

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
    const order = ['M', 'D', 'V', 'S'];
    return order.indexOf(a.productCategory) - order.indexOf(b.productCategory);
  });
  const items: BenefitDropdownItem[] = [];
  let id = 0;
  items.push({ label: 'All Types', value: 'A', id: '0' });
  sortedPlanDetails.forEach((plan) => {
    id++;
    switch (plan.productCategory) {
      case 'M':
        items.push({
          label: 'Medical',
          value: 'M',
          id: id.toString(),
        });
        id++;
        items.push({
          label: 'Pharmacy',
          value: 'R',
          id: id.toString(),
        });
        break;
      case 'D':
        items.push({
          label: 'Dental',
          value: 'D',
          id: id.toString(),
        });
        break;
      case 'V':
        items.push({
          label: 'Vision',
          value: 'V',
          id: id.toString(),
        });
        break;
      case 'S':
        items.push({
          label: 'Other',
          value: 'S',
          id: id.toString(),
        });
        break;
      default:
        break;
    }
  });

  return items;
};
