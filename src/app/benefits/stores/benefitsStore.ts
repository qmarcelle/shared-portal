import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import create from 'zustand';
import { MemberBenefitsBean } from '../models/member_benefits_bean';

interface BenefitsState {
  currentUserBenefitData: MemberBenefitsBean;
  setCurrentUserBenefitData: (data: MemberBenefitsBean) => void;
  userInfo: LoggedInUserInfo;
  setUserInfo: (data: LoggedInUserInfo) => void;
  memberIndex: number;
  setMemberIndex: (index: number) => void;
  selectedBenefitCategory: ServiceCategory;
  setSelectedBenefitCategory: (category: ServiceCategory) => void;
  selectedBenefitsBean: BenefitDetailsBean;
  setSelectedBenefitsBean: (benefits: BenefitDetailsBean) => void;
  memberBenefits: Record<number, MemberBenefitsBean>;
  setMemberBenefits: (memberCk: number, benefits: MemberBenefitsBean) => void;
  getMemberBenefits: (memberCk: number) => MemberBenefitsBean | undefined;
}

export const useBenefitsStore = create<BenefitsState>((set) => ({
  currentUserBenefitData: { memberCk: 0 },
  setCurrentUserBenefitData: (data) => set({ currentUserBenefitData: data }),
  userInfo: loggedInUserInfoMockResp,
  setUserInfo: (data) => set({ userInfo: data }),
  memberIndex: 0,
  setMemberIndex: (index) => set({ memberIndex: index }),
  selectedBenefitCategory: {
    id: 0,
    category: '',
    comments: '',
    displaySortOrder: 0,
  },
  setSelectedBenefitCategory: (category) =>
    set({ selectedBenefitCategory: category }),
  selectedBenefitsBean: {
    planId: '',
    productType: '',
    carveOutInfo: [],
    rateSchedule: [],
    networkTiers: [],
    serviceCategories: [],
    coveredServices: [],
  },
  setSelectedBenefitsBean: (benefits) =>
    set({ selectedBenefitsBean: benefits }),
  memberBenefits: {},
  setMemberBenefits: (memberCk, benefits) =>
    set((state) => ({
      memberBenefits: {
        ...state.memberBenefits,
        [memberCk]: benefits,
      },
    })),
  getMemberBenefits: (memberCk): MemberBenefitsBean =>
    useBenefitsStore.getState().memberBenefits[memberCk],
}));

export const getBenefitsForMember = (memberCk: number, benefitType: string) => {
  const memberBenefits = useBenefitsStore
    .getState()
    .getMemberBenefits(memberCk);
  switch (benefitType) {
    case 'M':
      return memberBenefits?.medicalBenefits;
    case 'D':
      return memberBenefits?.dentalBenefits;
    case 'V':
      return memberBenefits?.visionBenefits;
    case 'O':
      return memberBenefits?.otherBenefits;
    case 'R':
      return memberBenefits?.medicalBenefits;
    default:
      return undefined;
  }
};
