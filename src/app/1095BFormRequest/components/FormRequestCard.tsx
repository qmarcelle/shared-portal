import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

export const FormRequestCard = () => {
  return (
    <Card className="large-section">
      <Column className="flex flex-col">
        <TextBox className="title-2" text="Request a 1095-B Form" />

        <Spacer size={16} />
        <TextBox
          className="body-2"
          text="We’re sorry, but we don’t supply a 1095-B form for the type of coverage you have."
        />
        <Spacer size={16} />

        <TextBox
          className="body-2"
          text="If you had coverage last year through the Health Insurance Marketplace, Medicare Advantage, BlueCare or CoverKids Medicaid or CHIP, those organizations will provide your form. "
        />
        <Spacer size={16} />
        <RichText
          type="body-2"
          spans={[
            <span key={0}>
              If you have questions, talk to your employer or tax preparer. If
              you think we made a mistake please{' '}
            </span>,
            <span className="font-bold link" key={1}>
              <a href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}>
                contact us{' '}
              </a>
            </span>,
            <span key={2}>by phone, email or chat. </span>,
          ]}
        />

        <Spacer size={16} />
        <TextBox className="body-2" text=" Or write to us at:" />
        <Spacer size={16} />
        <TextBox className="body-2" text=" BlueCross BlueShield of Tennessee" />
        <TextBox className="body-2" text="Attn: 1095-B Request" />
        <TextBox className="body-2" text="3.2 - Membership Administration" />
        <TextBox className="body-2" text="1 Cameron Hill Circle" />
        <TextBox className="body-2" text="Chattanooga, TN 37402" />
      </Column>
    </Card>
  );
};
