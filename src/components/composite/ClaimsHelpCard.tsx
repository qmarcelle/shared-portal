/* eslint-disable react/jsx-key */
import { ChatTrigger } from '@/app/clicktochat/components/ChatTrigger';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichText } from '../foundation/RichText';
import { Spacer } from '../foundation/Spacer';

export type ClaimsHelpCardProps = {
  phoneNumber: string;
};

export const ClaimsHelpCard = ({ phoneNumber }: ClaimsHelpCardProps) => {
  return (
    <Column>
      <Card type="elevated" className="small-section">
        <Column>
          <Header className="title-2" text="Get Help with Claims" />
          <Spacer size={16} />
          <RichText
            spans={[
              <span>If you need help, please reach out to us. You can </span>,
              <span className="link">
                <ChatTrigger>start a chat</ChatTrigger>
              </span>,
              <span> or call us at {phoneNumber}.</span>,
            ]}
          />
          <Spacer size={16} />
          <RichText
            spans={[
              <span>You can also try our </span>,
              <span className="link">
                <a href="/member/support/FAQ/claims">Claims FAQ.</a>
              </span>,
            ]}
          />
        </Column>
      </Card>
    </Column>
  );
};
