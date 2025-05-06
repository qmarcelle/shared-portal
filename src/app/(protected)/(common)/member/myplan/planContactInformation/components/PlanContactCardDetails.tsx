import { PlanContactDetails } from '@/app/(protected)/(common)/member/myplan/planContactInformation/models/plan_contact_details';
import { IComponent } from '@/components/IComponent';
import { PlanContactCard } from './PlanContactCard';

interface PlanContactCardDetailsProps extends IComponent {
  planContactDetails: PlanContactDetails[];
}

export const PlanContactCardDetails = ({
  planContactDetails,
}: PlanContactCardDetailsProps) => {
  return (
    <>
      {planContactDetails.map((item, index) => (
        <PlanContactCard
          key={index}
          className="mb-4"
          memberName={item.name}
          DOB={item.dob}
          age={item.age}
          address={item.address}
          phone={item.phone}
        />
      ))}
      ,
    </>
  );
};
