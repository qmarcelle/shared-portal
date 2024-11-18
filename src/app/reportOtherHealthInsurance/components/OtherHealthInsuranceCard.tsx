import { Column } from '@/components/foundation/Column';
import { AddMemberDetails } from '@/models/add_member_details';
import { IComponent } from '../../../components/IComponent';
import { OtherHealthInsuranceDetails } from '../models/otherhealthinsurance_details';
import { OtherHealthInsuranceCardItem } from './OtherHealthInsuranceCardItem';

interface OtherHealthInsuranceCardProps extends IComponent {
  otherHealthInsuranceDetails: OtherHealthInsuranceDetails[];
  memberDetails: AddMemberDetails;
}

export const OtherHealthInsuranceCard = ({
  otherHealthInsuranceDetails,
  memberDetails,
}: OtherHealthInsuranceCardProps) => {
  return (
    <Column className="flex flex-col m-4 md:mt-0">
      {otherHealthInsuranceDetails.map((item, index) => (
        <OtherHealthInsuranceCardItem
          key={index}
          className="mb-4"
          memberName={item.memberName}
          DOB={item.DOB}
          updatedDate={item.updatedDate}
          memberDetails={memberDetails}
        />
      ))}
      ,
    </Column>
  );
};
