import { PriorAuthDetails } from '@/app/dashboard/models/priorAuth_details';
import { IComponent } from '../../../../components/IComponent';
import { AppLink } from '../../../../components/foundation/AppLink';
import { Card } from '../../../../components/foundation/Card';
import { Spacer } from '../../../../components/foundation/Spacer';
import { BlankPriorAuthSection } from './BlankPriorAuthSection';
import { PriorAuthCard } from './PrioAuthCard';

interface PriorAuthSectionProps extends IComponent {
  priorauth: PriorAuthDetails[];
}

export const PriorAuthSection = ({
  priorauth,
  className,
}: PriorAuthSectionProps) => {
  return (
    <Card className={className}>
      <div>
        <h2 className="title-2">Prior Authorization</h2>
        <Spacer size={32} />
        {(() => {
          if (priorauth.length !== 0) {
            return priorauth
              .slice(0, 3)
              .map((item) => (
                <PriorAuthCard
                  key={item.priorAuthName + item.priorAuthStatus}
                  priorAuthStatus={item.priorAuthStatus}
                  priorAuthName={item.priorAuthName}
                  member={item.member}
                  dateOfVisit={item.dateOfVisit}
                  priorAuthType={item.priorAuthType}
                />
              ));
          } else {
            return <BlankPriorAuthSection />;
          }
        })()}
        <Spacer size={32} />
        <AppLink label="View All Prior Authorization" />
      </div>
    </Card>
  );
};
