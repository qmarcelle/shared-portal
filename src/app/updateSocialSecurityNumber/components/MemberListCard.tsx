import { Column } from '@/components/foundation/Column';
import { IComponent } from '@/components/IComponent';
import { MemberListDetails } from '../models/app/member_list_detail';
import { MemberListItemCard } from './MemberListItemCard';

interface MemberListCardProps extends IComponent {
  memberListDetails: MemberListDetails[];
}

export const MemberListCard = ({ memberListDetails }: MemberListCardProps) => {
  return (
    <Column className="flex flex-col mt-4">
      <Column className="flex flex-col">
        {memberListDetails.map((item, index) => (
          <MemberListItemCard
            key={index}
            className="mb-4"
            memberName={item.memberName}
            dOB={item.dateOfBirth}
            isSSN={item.isSSN}
          />
        ))}
      </Column>
    </Column>
  );
};
