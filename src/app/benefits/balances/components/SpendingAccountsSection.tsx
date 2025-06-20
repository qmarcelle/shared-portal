import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { formatCurrency } from '@/utils/currency_formatter';

export interface SpendingAccountSectionProps extends IComponent {
  linkURL: string;
  hsaBalance: number;
  fsaBalance: number;
}

export const SpendingAccountSection = ({
  className,
  linkURL,
  hsaBalance,
  fsaBalance,
}: SpendingAccountSectionProps) => {
  return (
    <Card className={className}>
      <div>
        <Header className="title-2" text="Spending Accounts" />
        <Spacer size={32} />
        <Row>
          <Column>
            <TextBox text="HSA" className="py-4 px-7 font-bold" />
          </Column>
          <Column className="ml-4">
            <TextBox type="body-2" text="Health Saving Account Balance" />
            <TextBox
              className="font-bold"
              text={formatCurrency(hsaBalance) ?? '--'}
            />
          </Column>
        </Row>
        <Spacer size={21} />
        <Row>
          <Column>
            <TextBox
              text="FSA"
              className="py-4 px-7 font-bold spending-account-text"
            />
          </Column>
          <Column className="ml-4">
            <TextBox type="body-2" text="Flexible Spending Account Balance" />
            <TextBox
              className="font-bold"
              text={formatCurrency(fsaBalance) ?? '--'}
            />
          </Column>
        </Row>
        <Spacer size={18} />
        <AppLink label="View Spending Accounts" url={linkURL} />
      </div>
    </Card>
  );
};
