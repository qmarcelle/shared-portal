import { MemberData } from '@/actions/loggedUserInfo';
import { Column } from '@/components/foundation/Column';
import { AddMemberDetails } from '@/models/add_member_details';
import { IComponent } from '../../../components/IComponent';
import { OtherInsuranceData } from '../models/app/other_insurance_data';
import { OtherHealthInsuranceCardItem } from './OtherHealthInsuranceCardItem';

interface OtherHealthInsuranceCardProps extends IComponent {
  otherHealthInsuranceDetails: OtherInsuranceData;
  memberDetails: AddMemberDetails[];
  membersData: MemberData[];
}

export const OtherHealthInsuranceCard = ({
  otherHealthInsuranceDetails,
  memberDetails,
  membersData,
}: OtherHealthInsuranceCardProps) => {
  return (
    <Column className="flex flex-col m-4 md:mt-0">
      {otherHealthInsuranceDetails.cobList &&
        otherHealthInsuranceDetails.cobList.map((item, index) => (
          <OtherHealthInsuranceCardItem
            key={index}
            className="mb-4"
            memberDetails={memberDetails}
            cobDetails={item}
            membersData={membersData}
          />
        ))}
    </Column>
  );
};
