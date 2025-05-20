import { MemberData } from '@/actions/loggedUserInfo';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
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
      {otherHealthInsuranceDetails.cobList != null ? (
        otherHealthInsuranceDetails.cobList.map((item, index) => (
          <OtherHealthInsuranceCardItem
            key={index}
            className="mb-4"
            memberDetails={memberDetails}
            cobDetails={item}
            membersData={membersData}
          />
        ))
      ) : (
        <>
          <Column>
            <section className="flex justify-start self-start p-4">
              <ErrorInfoCard errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later." />
            </section>
          </Column>
        </>
      )}
    </Column>
  );
};
