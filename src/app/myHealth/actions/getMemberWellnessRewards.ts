import { getLoggedInMember } from '@/actions/memberDetails';
import { ESResponse } from '@/models/enterprise/esResponse';
import { esApi } from '@/utils/api/esApi';
import { logger } from '@/utils/logger';
import { Session } from 'next-auth';
import {
  MemberRewardsRequest,
  MemberRewardsResponse,
} from '../models/api/member_rewards';
import { MemberRewards } from '../models/app/my_health_data';

export const getMemberWellnessRewards = async (
  session: Session | null,
): Promise<MemberRewards> => {
  try {
    let memberRewards: MemberRewards = {} as MemberRewards;
    const loggedInMember = await getLoggedInMember(session);
    const request: MemberRewardsRequest = {
      memberId:
        loggedInMember.subscriberId +
        (loggedInMember.suffix < 10
          ? `0${loggedInMember.suffix}`
          : loggedInMember.suffix),
      accounts: {
        isBalance: true,
      },
    };

    logger.info('Member Rewards Request'+JSON.stringify(request));
    const response: ESResponse<MemberRewardsResponse> = (
      await esApi.post('/memberRewards/member/getMbrWellness', request)
    )?.data;
    logger.info('Member Rewards Response' + JSON.stringify(response));
    
    if (!response?.data?.accounts?.balance?.length) throw 'No Response';
    memberRewards = getRewards(response?.data, session);
    logger.info('memberRewards', memberRewards);
    return memberRewards;
  } catch (error) {
    logger.error('Error Response from Member Wellness Rewards', error);
    throw error;
  }
};

const getRewards = (
  response: MemberRewardsResponse,
  session: Session | null,
): MemberRewards => {
  const memberRewards: MemberRewards = {} as MemberRewards;
  let points: number | undefined;
  let dollars: number | undefined;
  const maxPoints: number = 100;
  const annualMaxDollars: number = 500;
  let pointConversion: number = 0;
  const balances = response.accounts?.balance;
  let isSelfFunded: boolean = true;

  if (session?.user.vRules?.fullyInsured || session?.user.vRules?.levelFunded) {
    isSelfFunded = false;
    pointConversion = 1;
    (balances || []).forEach((balanceObj) => {
      if (balanceObj.rewardType === 'Fully Insured - Points') {
        points = parseInt(balanceObj.balance);
      } else if (balanceObj.rewardType === 'Fully Insured - Dollars') {
        dollars = parseInt(balanceObj.balance);
      }
    });
    if (points && dollars) {
      if (points < 100) {
        dollars = 0.0;
      }
    } else if (!dollars && points) {
      if (points >= 100) {
        dollars = points * pointConversion;
      } else {
        dollars = 0.0;
      }
    } else if (!points && dollars) {
      points = dollars / pointConversion;
      if (points < 100) {
        dollars = 0.0;
      }
    } else {
      points = 0.0;
      dollars = 0.0;
    }

    memberRewards.quarterlyPointsEarned = points;
    memberRewards.quarterlyMaxPoints = maxPoints;
    memberRewards.totalAmountEarned = dollars;
    memberRewards.totalAmount = maxPoints * pointConversion;
    memberRewards.isSelfFunded = isSelfFunded;
  } else {
    dollars = 0;
    (balances || []).forEach((balanceObj) => {
      if (balanceObj.rewardType === 'Fully Insured - Dollars') {
        dollars = parseInt(balanceObj.balance);
      }
    });
    memberRewards.totalAmountEarned = dollars;
    memberRewards.totalAmount = annualMaxDollars;
    memberRewards.isSelfFunded = isSelfFunded;
  }
  //const pointsPercentage = (points / maxPoints) * 100.0;
  //const balanceMax = maxPoints * pointConversion;

  return memberRewards;
};

export const memRelation = async (session: Session | null): Promise<string> => {
  const loggedInMember = await getLoggedInMember(session);

  if (loggedInMember.memRelation === 'M') {
    return 'member';
  } else if (
    loggedInMember.memRelation === 'H' ||
    loggedInMember.memRelation === 'W'
  ) {
    return 'spouse';
  } else {
    return '';
  }
};
