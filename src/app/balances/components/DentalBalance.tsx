import { AppLink } from '@/components/foundation/AppLink';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Dropdown, SelectItem } from '../../../components/foundation/Dropdown';
import { Spacer } from '../../../components/foundation/Spacer';
import { ServicesUsed } from '../models/servicesused_details';
import { DentalBalanceChart } from './DentalBalanceChart';
import { ServicesUsedChart } from './ServicesUsedChart';

interface DentalBalanceProps extends IComponent {
  members: SelectItem[];
  selectedMemberId: string;
  deductibleSpent: number | null;
  deductibleLimit: number | null;
  outOfPocketSpent: number | null;
  outOfPocketLimit: number | null;
  serviceDetailsUsed: ServicesUsed[];
  onSelectedMemberChange: () => void;
}

export const DentalBalance = ({
  members,
  className,
  selectedMemberId,
  deductibleLimit,
  deductibleSpent,
  outOfPocketLimit,
  outOfPocketSpent,
  serviceDetailsUsed,
  onSelectedMemberChange,
}: DentalBalanceProps) => {
  return (
    <Card className={className}>
      <div>
        <h2 className="title-2">Dental Balance</h2>
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
        <Spacer size={32} />
        <DentalBalanceChart
          label="Deductible"
          spentAmount={deductibleSpent}
          limitAmount={deductibleLimit}
        />
        <Spacer size={32} />
        <DentalBalanceChart
          label="Out-of-Pocket"
          spentAmount={outOfPocketSpent}
          limitAmount={outOfPocketLimit}
        />
        <Spacer size={32} />
        <ServicesUsedChart
          label="Services Used"
          serviceDetails={serviceDetailsUsed}
        />
        <TextBox
          className="inline"
          type="body-2"
          text="Services Used is based on your processed items. There may be a delay in the Services Used list updating. If you're if a service has been used, "
        />
        <AppLink
          displayStyle="inline"
          className="underline py-0 px-1 body-2"
          label="start a chat"
        />
        <TextBox
          className="inline"
          type="body-2"
          text="or call us at [1-800-000-0000]."
        />
      </div>
    </Card>
  );
};
