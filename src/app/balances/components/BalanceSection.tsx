import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { ServicesUsed } from '@/models/app/servicesused_details';
import { formatCurrency } from '@/utils/currency_formatter';
import { useState } from 'react';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Dropdown, SelectItem } from '../../../components/foundation/Dropdown';
import { Spacer } from '../../../components/foundation/Spacer';
import { ProductBalance } from '../models/app/balancesData';
import { BalanceChart } from './BalanceChart';
import { ServicesUsedChart } from './ServicesUsedChart';

export interface BalanceSectionProps extends IComponent {
  title: string;
  members: SelectItem[];
  selectedMemberId: string;
  deductibleSpent: number | undefined;
  deductibleLimit: number | undefined;
  outOfPocketSpent: number | undefined;
  outOfPocketLimit: number | undefined;
  serviceDetailsUsed: ServicesUsed[];
  onSelectedMemberChange: (val: any) => void;
  onSelectedNetworkChange?: (val: any) => void;
  balanceNetworks?: SelectItem[];
  balancesFlag?: boolean;
  selectedNetworkId?: string;
  disclaimerText?: string;
  balanceDetailLink?: boolean;
}

export const BalanceSection = ({
  title,
  members,
  className,
  selectedMemberId,
  deductibleLimit,
  deductibleSpent,
  outOfPocketLimit,
  outOfPocketSpent,
  serviceDetailsUsed,
  onSelectedMemberChange,
  onSelectedNetworkChange,
  selectedNetworkId,
  balanceNetworks,
  disclaimerText,
  balanceDetailLink = false,
}: BalanceSectionProps) => {
  return (
    <Card className={className}>
      <Column>
        <h2 className="title-2">{title}</h2>
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
        {onSelectedNetworkChange && selectedNetworkId && balanceNetworks && (
          <>
            <Spacer size={18} />
            <Row>
              <p>Network Status :</p>
              <Spacer axis="horizontal" size={8} />
              <Dropdown
                onSelectCallback={onSelectedNetworkChange}
                initialSelectedValue={selectedNetworkId}
                items={balanceNetworks}
              />
            </Row>
          </>
        )}
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

        {!balanceDetailLink && balanceNetworks && (
          <>
            <Divider />
            <Spacer size={32} />
            <TextBox
              type="body-2"
              text="Your policy has separate limits for in- and out-of-network charges. Charges incurred with an in- network provider will apply to your in-network limit; charges incurred with an out-of-network provider will apply toward your out-of-network limit. Please note that individual out of pocket limits only apply if the family limit has not yet been satisfied."
            />
            <Spacer size={16} />
          </>
        )}

        {serviceDetailsUsed.length > 0 && (
          <ServicesUsedChart
            label="Services Used"
            serviceDetails={serviceDetailsUsed}
          />
        )}

        {balanceDetailLink && (
          <AppLink className="pl-0" label="View Balances" url="/balances" />
        )}
      </Column>
    </Card>
  );
};

type BalanceSectionWrapperProps = {
  product: ProductBalance | undefined;
  title: string;
  balanceDetailLink?: boolean;
};

export const BalanceSectionWrapper = ({
  title,
  product,
  balanceDetailLink,
}: BalanceSectionWrapperProps) => {
  const [selectedUser, setSelectedUser] = useState(product?.balances[0]);

  // 0 - In Network, 1- Out Network
  const [network, setNetwork] = useState(
    product?.balances[0].inNetDedMax ? '0' : undefined,
  );

  function changeUser(id: string) {
    if (product) {
      setSelectedUser(product.balances.find((item) => item.id == id)!);
    }
  }

  function changeNetwork(id: string) {
    setNetwork(id);
  }

  if (product == null) {
    return (
      <Card className="large-section">
        <Column>
          <TextBox type="title-2" text={title} />
          <Spacer size={32} />
          <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
        </Column>
      </Card>
    );
  }

  return (
    <BalanceSection
      className="large-section"
      title={title}
      members={product.balances.map((item) => ({
        label: item.name,
        value: item.id,
      }))}
      selectedMemberId={selectedUser!.id}
      onSelectedMemberChange={changeUser}
      balanceNetworks={
        network
          ? [
              { label: 'In-Network', value: '0' },
              { label: 'Out-of-Network', value: '1' },
            ]
          : undefined
      }
      selectedNetworkId={network}
      onSelectedNetworkChange={changeNetwork}
      balanceDetailLink={balanceDetailLink}
      deductibleLimit={
        network == '0'
          ? selectedUser!.inNetDedMax
          : selectedUser!.outOfNetDedMax
      }
      deductibleSpent={
        network == '0'
          ? selectedUser!.inNetDedMet
          : selectedUser!.outOfNetDedMet
      }
      outOfPocketLimit={
        network == '0'
          ? selectedUser!.inNetOOPMax
          : selectedUser!.outOfNetOOPMax
      }
      outOfPocketSpent={
        network == '0'
          ? selectedUser!.inNetOOPMet
          : selectedUser!.outOfNetOOPMet
      }
      serviceDetailsUsed={selectedUser!.serviceLimits
        .map((item) => {
          const service = product.serviceLimitDetails.find(
            (service) => service.code == item.accumCode,
          );
          if (service) {
            return {
              spentAmount: service.isDollar
                ? `${formatCurrency(item.value)}`
                : item.value.toString(),
              limitAmount: service.isDollar
                ? `${formatCurrency(service.maxValue) ?? ''}`
                : service.maxValue?.toString() ?? '',
              serviceName: service.desc,
            };
          } else {
            return null;
          }
        })
        .filter((item) => item != null)}
    />
  );
};
