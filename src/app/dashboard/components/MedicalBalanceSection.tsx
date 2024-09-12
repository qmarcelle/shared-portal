import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Divider } from '@/components/foundation/Divider';
import { Dropdown, SelectItem } from '@/components/foundation/Dropdown';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { BalanceChart } from './BalanceChart';

interface MedicalBalanceSectionProps extends IComponent {
  members: SelectItem[];
  selectedMemberId: string;
  balanceNetworks: SelectItem[];
  selectedNetworkId: string;
  deductibleSpent: number;
  deductibleLimit: number;
  outOfPocketSpent: number;
  outOfPocketLimit: number;
  onSelectedMemberChange: () => void;
  onSelectedNetworkChange: () => void;
  displayDisclaimerText: boolean;
  disclaimerText?: string;
}

export const MedicalBalanceSection = ({
  members,
  className,
  selectedMemberId,
  balanceNetworks,
  selectedNetworkId,
  deductibleLimit,
  deductibleSpent,
  outOfPocketLimit,
  outOfPocketSpent,
  onSelectedMemberChange,
  onSelectedNetworkChange,
  displayDisclaimerText,
  disclaimerText,
}: MedicalBalanceSectionProps) => {
  return (
    <Card className={className}>
      <div>
        <h2 className="title-2">Medical & Pharmacy Balance</h2>
        <Spacer size={32} />
        <div className="flex flex-row">
          <p>Member :</p>
          <Spacer axis="horizontal" size={8} />
          <Dropdown
            onSelectCallback={onSelectedMemberChange}
            initialSelectedValue={selectedMemberId}
            items={members}
          />
        </div>
        <Spacer size={18} />
        <div className="flex flex-row">
          <p>Network Status :</p>
          <Spacer axis="horizontal" size={8} />
          <Dropdown
            onSelectCallback={onSelectedNetworkChange}
            initialSelectedValue={selectedNetworkId}
            items={balanceNetworks}
          />
        </div>
        <Spacer size={32} />
        <BalanceChart
          label="Deductible"
          spentAmount={deductibleSpent}
          limitAmount={deductibleLimit}
        />
        <Spacer size={32} />
        <BalanceChart
          label="Out-of-Pocket"
          spentAmount={outOfPocketSpent}
          limitAmount={outOfPocketLimit}
        />
        <Spacer size={32} />
        {!displayDisclaimerText && <AppLink label="View All Balances" />}
        {displayDisclaimerText && disclaimerText && (
          <>
            <Divider />
            <Spacer size={32} />
            <TextBox type="body-2" text={disclaimerText} />
          </>
        )}
      </div>
    </Card>
  );
};
