import { ChatTrigger } from '@/app/clicktochat/components/ChatTrigger';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichText } from '../foundation/RichText';
import { Spacer } from '../foundation/Spacer';

export const BankFormHelp = () => (
  <Column>
    <Card type="elevated" className="small-section">
      <Column>
        <Header className="title-2" text="Get Help with the Bank Draft Form" />
        <Spacer size={16} />
        <RichText
          spans={[
            <span key="1">
              If you need help, please reach out to us. You can{' '}
            </span>,
            <span key="2" className="link font-bold">
              <ChatTrigger>start a chat</ChatTrigger>
            </span>,
            <span key="3"> or call us at [1-800-000-000].</span>,
          ]}
        />
      </Column>
    </Card>
  </Column>
);
