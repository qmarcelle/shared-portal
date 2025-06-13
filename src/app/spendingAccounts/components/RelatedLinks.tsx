import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { extrenalIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';

interface RelatedLinkProps {
  expensesURL: string;
}

export const RelatedLinks = ({ expensesURL }: RelatedLinkProps) => {
  return (
    <Card className="md:ml-8 p-8">
      <Column className="flex flex-col">
        <Header type="title-2" text="Related Links"></Header>
        <Spacer size={24} />
        <AppLink
          label="Direct Deposit Form"
          url="/assets/spending_acc_direct_deposit_form.pdf"
          target="_blank"
          className="link no-underline !flex caremark"
          icon={<Image src={extrenalIcon} alt="" />}
        />
        <Spacer size={16} />
        <Row>
          Make transactions quick and easy. setup direct deposit for your
          spending account
        </Row>
        {expensesURL && (
          <>
            <Spacer size={24} />
            <Divider></Divider>
            <Spacer size={24} />
            <AppLink
              label="Eligible Expenses"
              url={expensesURL}
              target="_blank"
              className="link no-underline !flex caremark"
              icon={<Image src={extrenalIcon} alt="" />}
            />
            <Spacer size={16} />
            <Row>
              Discover what medical expenses your health saving account may
              cover - from prescriptions to fitness programs.
            </Row>
          </>
        )}
      </Column>
    </Card>
  );
};
