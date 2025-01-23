import { Member, PlanDetail } from '@/models/member/api/loggedInUserInfo';
import {
  getBenefitTypes,
  getMemberDropdownValues,
} from '../../../app/benefits/actions/benefitsUtils';
import { logger } from '../../../utils/logger';

jest.mock('../../../utils/logger');

describe('benefitsUtils', () => {
  describe('getMemberDropdownValues', () => {
    it('should map members to dropdown values', () => {
      const members: Member[] = [
        {
          firstName: 'John',
          lastName: 'Doe',
          memberCk: 1,
          isActive: true,
          memberOrigEffDt: '01/01/2020',
          middleInitial: '',
          title: '' /* add other required properties */,
          memRelation: '',
          birthDate: '',
          gender: '',
          memberSuffix: 0,
          mailAddressType: '',
          workPhone: '',
          otherInsurance: [],
          coverageTypes: [],
          planDetails: [],
          inXPermissions: false,
          futureEffective: false,
          loggedIn: false,
          hasSocial: false,
          esipharmacyEligible: false,
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          memberCk: 2,
          isActive: true,
          memberOrigEffDt: '01/01/2020',
          middleInitial: '',
          title: '' /* add other required properties */,
          memRelation: '',
          birthDate: '',
          gender: '',
          memberSuffix: 0,
          mailAddressType: '',
          workPhone: '',
          otherInsurance: [],
          coverageTypes: [],
          planDetails: [],
          inXPermissions: false,
          futureEffective: false,
          loggedIn: false,
          hasSocial: false,
          esipharmacyEligible: false,
        },
      ];

      const result = getMemberDropdownValues(members);

      expect(result).toEqual([
        { label: 'John Doe', value: '1', id: '0' },
        { label: 'Jane Smith', value: '2', id: '1' },
      ]);
      expect(logger.info).toHaveBeenCalledWith(
        'Mapping members to dropdown values',
      );
    });
  });

  describe('getBenefitTypes', () => {
    it('should return sorted benefit types', () => {
      const planDetails: PlanDetail[] = [
        {
          productCategory: 'D',
          planID: '54321',
          effectiveDate: 20200101,
          planStartDate: 20200101,
          planClassID: 'C3',
          networkPlanName: 'Dental Plan',
        },
        {
          productCategory: 'M',
          planID: '12345',
          effectiveDate: 20200101,
          planStartDate: 20200101,
          planClassID: 'A1',
          networkPlanName: 'Health Network Plan',
        },
        {
          productCategory: 'V',
          planID: '54321',
          effectiveDate: 20200101,
          planStartDate: 20200101,
          planClassID: 'C3',
          networkPlanName: 'Vision Plan',
        },
      ];

      const result = getBenefitTypes(planDetails);
      console.log(result);
      expect(result).toEqual([
        { label: 'All Types', value: 'A', id: '0' },
        { label: 'Medical', value: 'M', id: '1' },
        { label: 'Pharmacy', value: 'R', id: '2' },
        { label: 'Dental', value: 'D', id: '3' },
        { label: 'Vision', value: 'V', id: '4' },
        { label: 'Other', value: 'S', id: '5' },
      ]);
    });
  });
});
