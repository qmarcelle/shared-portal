import { loggedInUserInfoMockResp } from '@/mock/loggedInUserInfoMockResp';
import { LoggedInUserInfo } from '@/models/member/api/loggedInUserInfo';
import create from 'zustand';
import { MemberBenefitsBean } from '../models/member_benefits_bean';

interface BenefitsDetails {
  networkTiers: NetWorksAndTierInfo[];
  coveredServices: { serviceDetails: ServiceDetails[] }[];
  serviceCategory: { category: string; id: number };
}

interface BenefitsState {
  currentUserBenefitData: MemberBenefitsBean;
  setCurrentUserBenefitData: (data: MemberBenefitsBean) => void;
  userInfo: LoggedInUserInfo;
  setUserInfo: (data: LoggedInUserInfo) => void;
  memberIndex: number;
  setMemberIndex: (index: number) => void;
  selectedBenefitDetails: BenefitsDetails;
  setSelectedBenefitDetails: (category: BenefitsDetails) => void;
}

export const useBenefitsStore = create<BenefitsState>((set) => ({
  currentUserBenefitData: { memberCk: 0 },
  setCurrentUserBenefitData: (data) => set({ currentUserBenefitData: data }),
  userInfo: loggedInUserInfoMockResp,
  setUserInfo: (data) => set({ userInfo: data }),
  memberIndex: 0,
  setMemberIndex: (index) => set({ memberIndex: index }),
  selectedBenefitDetails: {
    networkTiers: [],
    coveredServices: [],
    serviceCategory: { category: '', id: 0 },
  },
  setSelectedBenefitDetails: (details) =>
    set({ selectedBenefitDetails: details }),
}));
