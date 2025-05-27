import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { DashboardPriorAuthDetails } from '../models/priorAuth_details';
import { BlankPriorAuthSection } from './BlankPriorAuthSection';
import { PriorAuthCard } from './PriorAuthCard';

interface PriorAuthSectionProps extends IComponent {
  priorAuth: DashboardPriorAuthDetails | null;
}

export const PriorAuthSection = ({
  priorAuth,
  className,
}: PriorAuthSectionProps) => {
  return (
    <Card className={className}>
      <div>
        <h2 className="title-2">Prior Authorization</h2>
        <Spacer size={32} />
        {(() => {
          if (priorAuth === null) {
            return <BlankPriorAuthSection />;
          } else {
            return (
              <PriorAuthCard
                key={priorAuth.referenceId}
                priorAuth={priorAuth}
              />
            );
          }
        })()}
        <Spacer size={32} />
        <AppLink
          label="View Prior Authorizations"
          url="/member/myplan/priorauthorizations"
        />
      </div>
    </Card>
  );
};
