export interface MemberRewardsRequest {
  memberId: string;
  accounts: MemberRewardsAccounts;
}

interface MemberRewardsAccounts {
  isBalance: boolean;
  isProfile?: boolean;
  isHistory?: boolean;
  isSegments?: boolean;
  isSummary?: boolean;
  isActivities?: boolean;
  isRewardTypes?: boolean;
  balance?: MemberRewardTypes;
  summary?: MemberRewardTypes;
}

interface MemberRewardTypes {
  rewardTypes: string[];
}

export interface MemberRewardsResponse {
  accounts: MemberRewardsAccountsResponse;
}

interface MemberRewardsAccountsResponse {
  balance: MemberRewardsBalance[];
}

interface MemberRewardsBalance {
  rewardType: string;
  balance: string;
}
