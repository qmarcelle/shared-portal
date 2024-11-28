import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { VisibilityRules } from '@/visibilityEngine/rules';
import { OtherPlanInformation } from '../model/app/otherPlanInformation';
import { BlueCarePlanInformation } from '../model/app/blueCarePlanInformation';
import { externalIcon } from '@/components/foundation/Icons';
import Image from 'next/image';
import { isBlueCareEligible } from '@/visibilityEngine/computeVisibilityRules';

export type ViewOtherPlanInformationProps = {
  visibilityRules?: VisibilityRules;
};

export const ViewOtherPlanInformation = ({
  visibilityRules,
}: ViewOtherPlanInformationProps) => {
  let viewOtherPlanInformationDetails;

  if (isBlueCareEligible(visibilityRules))
    viewOtherPlanInformationDetails = BlueCarePlanInformation;
  else viewOtherPlanInformationDetails = OtherPlanInformation;

  return (
    <Column>
      {viewOtherPlanInformationDetails.map((item) => {
        return (
          <InfoCard
            key={item.label}
            label={item.label}
            icon={item.iconName}
            body={item.description}
            link={item.link}
            suffix={
              item.label == 'Member Handbook' ? (
                <Image src={externalIcon} alt="external" />
              ) : undefined
            }
          />
        );
      })}
    </Column>
  );
};
