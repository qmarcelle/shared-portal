import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import { externalIcon } from '@/components/foundation/Icons';
import {
  isAnnualStatementEligible,
  isBlueCareEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import { BlueCarePlanInformation } from '../model/app/blueCarePlanInformation';
import { CommercialPlanInformation } from '../model/app/commercialPlanInformation';
import { OtherPlanInformation } from '../model/app/otherPlanInformation';

export type ViewOtherPlanInformationProps = {
  visibilityRules?: VisibilityRules;
};

export const ViewOtherPlanInformation = ({
  visibilityRules,
}: ViewOtherPlanInformationProps) => {
  let viewOtherPlanInformationDetails;

  if (isBlueCareEligible(visibilityRules))
    viewOtherPlanInformationDetails = BlueCarePlanInformation;
  else if (isAnnualStatementEligible(visibilityRules))
    viewOtherPlanInformationDetails = CommercialPlanInformation;
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
                <Image src={externalIcon} alt="" />
              ) : undefined
            }
          />
        );
      })}
    </Column>
  );
};
