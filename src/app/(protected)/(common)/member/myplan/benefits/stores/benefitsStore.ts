import { Member } from '@/models/member/api/loggedInUserInfo';
import create from 'zustand';
import { MemberBenefitsBean } from '../models/member_benefits_bean';

interface BenefitsDetails {
  networkTiers: NetWorksAndTierInfo[];
  coveredServices: { serviceDetails: ServiceDetails[] }[];
  serviceCategory: { category: string; id: number };
  benefitType: string;
}

interface BenefitsState {
  currentUserBenefitData: MemberBenefitsBean;
  setCurrentUserBenefitData: (data: MemberBenefitsBean) => void;
  selectedBenefitDetails: BenefitsDetails;
  setSelectedBenefitDetails: (category: BenefitsDetails) => void;
  currentSelectedMember: Member;
  setCurrentSelectedMember: (member: Member) => void;
  currentSelectedBenefitType: string;
  setCurrentSelectedBenefitType: (benefitType: string) => void;
}

export const useBenefitsStore = create<BenefitsState>((set) => ({
  currentUserBenefitData: { memberCk: 0 } as MemberBenefitsBean,
  setCurrentUserBenefitData: (data) => set({ currentUserBenefitData: data }),
  selectedBenefitDetails: {
    networkTiers: [],
    coveredServices: [],
    serviceCategory: { category: '', id: 0 },
    benefitType: 'M',
  },
  setSelectedBenefitDetails: (details) =>
    set({ selectedBenefitDetails: details }),
  currentSelectedMember: {
    isActive: false,
    memberOrigEffDt: '',
    memberCk: 0,
    firstName: '',
    middleInitial: '',
    lastName: '',
    title: '',
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
  } as Member,
  setCurrentSelectedMember(member) {
    set({ currentSelectedMember: member });
  },
  currentSelectedBenefitType: 'A',
  setCurrentSelectedBenefitType(benefitType) {
    set({ currentSelectedBenefitType: benefitType });
  },
}));
