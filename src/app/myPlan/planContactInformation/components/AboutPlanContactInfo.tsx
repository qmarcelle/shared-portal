import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';

export const AboutPlanContactInfo = () => {
  return (
    <Card className="small-section !mt-0">
      <Column>
        <Header type="title-2" text="About Plan Contact Information" />
        <Spacer size={16} />
        <RichText
          type="body-1"
          spans={[
            <span key={0}>
              This is the contact information you gave us when you started your
              plan. It&apos;s important to keep it up to date. To change it, you
              can contact your employer or{' '}
            </span>,
            <span className="link" key={1}>
              <a> start a chat </a>
            </span>,
            <span key={3}> with us.</span>,
          ]}
        />
        <Spacer size={12} />
        <RichText
          type="body-1"
          spans={[
            <span key={0}>
              Keep in mind, this is not necessarily the phone number you use for
              keeping your account secure. For that info,{' '}
            </span>,
            <span className="link" key={1}>
              <a> check profile settings.</a>
            </span>,
          ]}
        />
      </Column>
    </Card>
  );
};
