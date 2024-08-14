import { ClaimDetails } from '@/app/dashboard/models/claim_details';
import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import { ClaimItem } from './ClaimItem';

interface RecentClaimSectionProps extends IComponent {
  claims: ClaimDetails[];
}

export const RecentClaimSection = ({
  claims,
  className,
}: RecentClaimSectionProps) => {
  return (
    <Card className={className}>
      <div className="flex flex-col">
        <h2 className="title-2">Recent Claims</h2>
        <Spacer size={32} />
        {claims.slice(0, 3).map((item) => (
          <ClaimItem key={item.id} className="mb-4" claimInfo={item} />
        ))}
        <Spacer size={16} />
        <AppLink label="View All Claims" />
      </div>
    </Card>
  );
};
