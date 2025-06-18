import { ChatTrigger } from '@/app/clicktochat/components/ChatTrigger';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';

export type HelpWithPrimaryCareProviderProps = {
  contact: string;
};

export const HelpWithPrimaryCareProvider = ({
  contact,
}: HelpWithPrimaryCareProviderProps) => {
  return (
    <Card className="mt-4 p-8">
      <Column className="flex flex-col">
        <Header
          type="title-2"
          text="Help with My Primary Care Provider"
        ></Header>
        <Spacer size={16} />
        <RichText
          spans={[
            <span key={0}>
              If you need help, please reach out to us.You can{' '}
            </span>,
            <span className="link" key={1}>
              <ChatTrigger>start a chat</ChatTrigger>
            </span>,
            <span key={2}>or call us at [{contact}].</span>,
          ]}
        />
      </Column>
    </Card>
  );
};
