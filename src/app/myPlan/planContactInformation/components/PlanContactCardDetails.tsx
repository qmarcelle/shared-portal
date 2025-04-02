import { IComponent } from '../../../../components/IComponent';
import { AllMyPlanData } from '../../model/app/myPlanData';
import { PlanContactCard } from './PlanContactCard';

interface PlanContactCardDetailsProps extends IComponent {
  planContactDetails: AllMyPlanData<string>[];
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
          name={item.memberName}
          dob={item.dob}
          age={item.age}
          address={item.address}
          primaryPhoneNumber={item.primaryPhoneNumber}
          secondaryPhoneNumber={item.secondaryPhoneNumber}
        />
      ))}
    </>
  );
};
