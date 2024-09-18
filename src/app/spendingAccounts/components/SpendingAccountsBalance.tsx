import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { PlansLabel } from '@/components/foundation/PlansLabel';
import { Row } from '@/components/foundation/Row';
import { IComponent } from '../../../components/IComponent';
import { AppLink } from '../../../components/foundation/AppLink';
import { Card } from '../../../components/foundation/Card';
import { Dropdown, SelectItem } from '../../../components/foundation/Dropdown';
import { Spacer } from '../../../components/foundation/Spacer';

interface SpendingAccountProps extends IComponent {
  details: SelectItem[];
  selectedDetailId: string;

  contributionsAmount: number;
  distributionsAmount: number;
  balanceAmount: number;
  transactionsLabel: string;
  spendingBalanceTitle: string;
  onSelectedDetailChange: () => void;
}

export const SpendingAccountsBalance = ({
  details,
  className,
  selectedDetailId,
  contributionsAmount,
  distributionsAmount,
  balanceAmount,
  transactionsLabel,
  spendingBalanceTitle,
  onSelectedDetailChange,
}: SpendingAccountProps) => {
  return (
    <Card className={className}>
      <Column>
        <Row>
          <PlansLabel label={'HSA'} color={'bg-sky-100'} />
          <Column className="justify-center items-center ml-2">
            <Header text={spendingBalanceTitle} className="title-2" />
          </Column>
        </Row>

        <Spacer size={32} />
        <Row>
          <p>Viewing details for:</p>
          <Spacer axis="horizontal" size={8} />
          <Dropdown
            onSelectCallback={onSelectedDetailChange}
            initialSelectedValue={selectedDetailId}
            items={details}
          />
        </Row>
        <Spacer size={32} />

        <Row>
          <Column className="flex-grow">Contributions</Column>
          <Column className="items-end">${contributionsAmount}.00</Column>
        </Row>
        <Row>
          <Column className="flex-grow">Distributions</Column>
          <Column className="items-end">-${distributionsAmount}.00</Column>
        </Row>
        <Spacer size={32} />
        <Divider></Divider>
        <Spacer size={32} />
        <Row>
          <Column className="flex-grow font-bold">Balance</Column>
          <Column className="font-bold items-end">${balanceAmount}.00</Column>
        </Row>
        <AppLink label={transactionsLabel} />
        <Spacer size={32} />
      </Column>
    </Card>
  );
};
