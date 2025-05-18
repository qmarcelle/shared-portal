import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { DashboardPriorAuthDetails } from '../models/priorAuth_details';
import { BlankPriorAuthSection } from './BlankPriorAuthSection';
import { PriorAuthCard } from './PrioAuthCard';

interface PriorAuthSectionProps extends IComponent {
  priorauth: DashboardPriorAuthDetails | null;
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
          if (priorauth !== null) {
            return (
              <PriorAuthCard
                key={priorauth.priorAuthName + priorauth.priorAuthStatus}
                priorauth={priorauth}
              />
            );
          } else {
            return <BlankPriorAuthSection />;
          }
        })()}
        <Spacer size={32} />
        <AppLink label="View Prior Authorizations" url="/priorAuthorization" />
      </div>
    </Card>
  );
};
