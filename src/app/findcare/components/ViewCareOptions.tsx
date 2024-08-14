'use client';

import { ClaimItem } from '@/app/dashboard/components/ClaimItem';
import { ClaimDetails } from '@/app/dashboard/models/claim_details';
import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';

interface ViewCareOptionsProps extends IComponent {
  claims: ClaimDetails[];
}

export const ViewCareOptions = ({
  claims,
  className,
}: ViewCareOptionsProps) => {
  return (
    <Column className={className}>
      <Column className="flex flex-col">
        <Title className="title-1" text="View Care Options" />
        <Spacer size={32} />
        {claims.slice(0, 3).map((item) => (
          <ClaimItem key={item.id} className="mb-4" claimInfo={item} />
        ))}
      </Column>
    </Column>
  );
};
