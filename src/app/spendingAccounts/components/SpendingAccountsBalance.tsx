import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { PlansLabel } from '@/components/foundation/PlansLabel';
import { Row } from '@/components/foundation/Row';
import { useRouter } from 'next/navigation';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Dropdown, SelectItem } from '../../../components/foundation/Dropdown';
import { LinkRow } from '../../../components/foundation/LinkRow';
import { Spacer } from '../../../components/foundation/Spacer';
import { SpendingBalanceYearData } from '../model/spendingBalanceYearData';

interface SpendingAccountProps extends IComponent {
  details: SelectItem[];
  selectedDetailId: string;
  yearBalanceInfo: SpendingBalanceYearData;
  transactionsLabel: string;
  spendingBalanceTitle: string;
  accountTypeText: string;
  onSelectedDetailChange: (val: string) => void;
}

export const SpendingAccountsBalance = ({
  details,
  className,
  selectedDetailId,
  yearBalanceInfo,
  transactionsLabel,
  spendingBalanceTitle,
  accountTypeText,
  onSelectedDetailChange,
}: SpendingAccountProps) => {
  const router = useRouter();
  return (
    <Card className={className}>
      <Column>
        <Row>
          <PlansLabel label={accountTypeText} color={'bg-sky-100'} />
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
          <Column className="items-end">
            {yearBalanceInfo.contributionsAmount}
          </Column>
        </Row>
        <Row>
          <Column className="flex-grow">Distributions</Column>
          <Column className="items-end">
            -{yearBalanceInfo.distributionsAmount}
          </Column>
        </Row>
        <Spacer size={32} />
        <Divider></Divider>
        <Spacer size={32} />
        <Row>
          <Column className="flex-grow font-bold">Balance</Column>
          <Column className="font-bold items-end">
            {yearBalanceInfo.balanceAmount}
          </Column>
        </Row>
        {accountTypeText != 'HRA' && (
          <LinkRow
            label={transactionsLabel}
            onClick={() => {
              router.push('/spendingAccounts/transactions');
            }}
          />
        )}
        <Spacer size={32} />
      </Column>
    </Card>
  );
};
