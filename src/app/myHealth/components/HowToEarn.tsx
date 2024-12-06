import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { EarnRewardsDetails } from '@/models/earn_rewards_details';
import { ReactNode } from 'react';
import { RewardItem } from './rewardsCard';

interface HowToEarnProps extends IComponent {
  rewards: EarnRewardsDetails[];
  title: string;
  linkText: string;
  linkIcon: ReactNode;
  linkCallBack?: () => void;
}

export const HowToEarn = ({
  rewards,
  className,
  title,
  linkText,
  linkIcon,
  linkCallBack,
}: HowToEarnProps) => {
  return (
    <Card className={className}>
      <div className="flex flex-col m-4">
        <Header type="title-2" className="ml-2 mt-4" text={title} />
        <Spacer size={32} />
        {rewards.map((item) => (
          <RewardItem key={item.id} className="mb-4" rewardInfo={item} />
        ))}
        <Spacer size={16} />
        <AppLink
          className="!flex"
          label={linkText}
          icon={linkIcon}
          callback={() => {
            linkCallBack?.();
          }}
        />
      </div>
    </Card>
  );
};
