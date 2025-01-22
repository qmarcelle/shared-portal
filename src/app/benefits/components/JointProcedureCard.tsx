import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
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
        <h2 className="title-3">Call Before Scheduling Your Joint Procedure</h2>
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
            <span className="link-white-text" key={2}>
              <a>start a chat</a>
            </span>,
            <span key={3}>{' now.'}</span>,
          ]}
        />
      </Column>
    </Card>
  );
};
