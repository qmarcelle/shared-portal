import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

// UnderstandingClaimsReimbursementCard component

export const UnderstandingClaimsReimbursementCard = () => {
  return (
    <Card>
      <Column className="m-8">
        <Header className="title-2" text="Understanding Claims Reimbursement" />
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="Follow the instructions included on the claim form. In most cases, you'll need to print the form, fill it out and then mail it to the address listed on the form."
          ariaLabel="Follow the instructions included on the claim form. In most cases, you'll need to print the form, fill it out and then mail it to the address listed on the form.."
        ></TextBox>
        <Spacer size={32} />
        <RichText
          type="body-1"
          spans={[
            <span key={0}>If you need help, </span>,
            <span className="link" key={1}>
              <a> start a chat </a>
            </span>,
            <span key={3}> or call us at [1-800-000-0000].</span>,
          ]}
        />
      </Column>
    </Card>
  );
};
