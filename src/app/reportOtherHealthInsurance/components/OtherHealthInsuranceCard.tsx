import { Column } from '@/components/foundation/Column';
import { IComponent } from '../../../components/IComponent';
import { OtherHealthInsuranceDetails } from '../models/otherhealthinsurance_details';
import { OtherHelathInsuranceCardItem } from './OtherHealthInsuranceCardItem';

interface OtherHealthInsuranceCardProps extends IComponent {
  otherHealthInsuranceDetails: OtherHealthInsuranceDetails[];
}

export const OtherHealthInsuranceCard = ({
  otherHealthInsuranceDetails,
}: OtherHealthInsuranceCardProps) => {
  return (
    <Column className="flex flex-col m-4 md:mt-0">
      {otherHealthInsuranceDetails.map((item, index) => (
        <OtherHelathInsuranceCardItem
          key={index}
          className="mb-4"
          memberName={item.memberName}
          DOB={item.DOB}
          updatedDate={item.updatedDate}
        />
      ))}
    </Column>
  );
};
