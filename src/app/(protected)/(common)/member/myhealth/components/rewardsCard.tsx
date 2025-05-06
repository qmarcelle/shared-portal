import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { EarnRewardsDetails } from '@/models/earn_rewards_details';

interface RewardItemProps extends IComponent {
  rewardInfo: EarnRewardsDetails;
}

export const RewardItem = ({ rewardInfo, className }: RewardItemProps) => {
  function getRewardItem() {
    return (
      <section className="flex flex-row">
        <Column className="p-4 h-auto w-[72px] items-center text-center justify-center bg-primary-focus rounded-l-[8px]">
          <TextBox text={rewardInfo.rewardPoints} className="text-white" />
        </Column>
        <Column className="px-5 py-4">
          <TextBox
            className="body-1 font-bold my-2"
            text={rewardInfo.rewardTitle}
          />
          <TextBox text={rewardInfo.rewardDescription} />
        </Column>
      </section>
    );
  }

  return (
    <Card className={`cursor-pointer ${className}`} type="button">
      {getRewardItem()}
    </Card>
  );
};
