import { ChatTrigger } from '@/app/clicktochat/components/ChatTrigger';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';

interface JointProcedureCardProps extends IComponent {
  phoneNumber: string;
}

export const JointProcedureCard = ({
  className,
  phoneNumber,
}: JointProcedureCardProps) => {
  return (
    <Card className={className} type="info">
      <Column>
        <Header
          className="title-2-bold"
          type="title-2"
          text="Call Before Scheduling Your Joint Procedure"
        />
        <Spacer size={32} />
        <RichText
          type="body-1"
          spans={[
            <span key={0}>
              {
                'Your plan requires giving us a call before pursuing knee, hip, or spine procedures. Give us a call at '
              }
            </span>,
            <span key={1}>{`[${phoneNumber}] or `}</span>,
            <span className="font-bold  link-white-text" key={2}>
              <ChatTrigger>start a chat</ChatTrigger>
            </span>,
            <span key={3}>{' now.'}</span>,
          ]}
        />
      </Column>
    </Card>
  );
};
