import { ClaimItem } from '@/components/composite/ClaimItem';
import { Header } from '@/components/foundation/Header';
import { ClaimDetails } from '@/models/claim_details';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Card } from '../foundation/Card';
import { Spacer } from '../foundation/Spacer';

interface RecentClaimSectionProps extends IComponent {
  claims: ClaimDetails[];
  title: string;
  linkText: string;
  linkCallBack?: () => void;
}

export const RecentClaimSection = ({
  claims,
  className,
  title,
  linkText,
  linkCallBack,
}: RecentClaimSectionProps) => {
  return (
    <Card className={className}>
      <div className="flex flex-col">
        <Header className="title-2" text={title} />
        <Spacer size={32} />
        {claims.slice(0, 3).map((item) => (
          <ClaimItem
            key={item.id}
            className="mb-4"
            claimInfo={item}
            callBack={(claimId: string) => {
              item.callBack?.(claimId);
            }}
          />
        ))}
        <Spacer size={16} />
        <AppLink
          label={linkText}
          callback={() => {
            linkCallBack?.();
          }}
        />
      </div>
    </Card>
  );
};
