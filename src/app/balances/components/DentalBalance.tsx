import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Dropdown, SelectItem } from '../../../components/foundation/Dropdown';
import { Spacer } from '../../../components/foundation/Spacer';
import { ServicesUsed } from '../../../models/app/servicesused_details';
import { DentalBalanceChart } from './DentalBalanceChart';
import { ServicesUsedChart } from './ServicesUsedChart';

export interface DentalBalanceProps extends IComponent {
  members: SelectItem[];
  selectedMemberId: string;
  deductibleSpent: number | null;
  deductibleLimit: number | null;
  outOfPocketSpent: number | null;
  outOfPocketLimit: number | null;
  serviceDetailsUsed: ServicesUsed[];
  onSelectedMemberChange: () => void;
  balancesFlag: boolean;
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
  balancesFlag,
}: DentalBalanceProps) => {
  return (
    <Card className={className}>
      <Column>
        <h2 className="title-2">Dental Balance</h2>
        <Spacer size={32} />
        <Row className="flex flex-row">
          <p>Member :</p>
          <Spacer axis="horizontal" size={8} />
          <Dropdown
            onSelectCallback={onSelectedMemberChange}
            initialSelectedValue={selectedMemberId}
            items={members}
          />
        </Row>
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
        {balancesFlag ? (
          <Column>
            <RichText
              type="body-2"
              spans={[
                <span key={0}>
                  Services Used is based on your processed items. There may be a
                  delay in the Services Used list updating. If you&apos;re
                  unsure if a service has been used,{' '}
                </span>,
                <span className="link" key={1}>
                  <a> start a chat </a>
                </span>,
                <span key={3}> or call us at [1-800-000-0000].</span>,
              ]}
            />
          </Column>
        ) : (
          <AppLink label="View Balances" url="/balances" />
        )}
      </Column>
    </Card>
  );
};
