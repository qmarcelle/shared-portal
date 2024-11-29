import { Column } from '@/components/foundation/Column';
import { IComponent } from '@/components/IComponent';
import { Member } from '../models/app/memberList';
import { MemberListItemCard } from './MemberListItemCard';

interface MemberListCardProps extends IComponent {
  memberListDetails: Member[];
  successCallback: () => void;
}

export const MemberListCard = ({
  memberListDetails,
  successCallback,
}: MemberListCardProps) => {
  return (
    <Column className="flex flex-col mt-4">
      <Column className="flex flex-col">
        {memberListDetails.map((item, index) => (
          <MemberListItemCard
            key={index}
            className="mb-4"
            memberName={item.firstName + ' ' + item.lastName}
            dateOfBirth={item.birthDate}
            isSSN={item.hasSocial}
            successCallback={() => successCallback()}
          />
        ))}
      </Column>
    </Column>
  );
};
