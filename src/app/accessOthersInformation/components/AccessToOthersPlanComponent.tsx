import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ReactElement } from 'react';
import { AccessOtherPlanDetails } from '../models/AccessOtherPlanDetails';
import { AccessToOthersPlanItem } from './AccessToOthersPlanItem';

interface AccessToOthersPlanComponentProps extends IComponent {
  accessOtherPlanDetails: AccessOtherPlanDetails[] | null;
  header?: ReactElement;
  subHeader?: ReactElement;
  infoIcon: boolean;
}

export const AccessToOthersPlanComponent = ({
  accessOtherPlanDetails,
  header,
  subHeader,
}: AccessToOthersPlanComponentProps) => {
  return (
    <Column className="flex flex-col">
      {header}
      {subHeader && (
        <div>
          {' '}
          <Spacer size={16} />
          {subHeader}
        </div>
      )}
      <Column className="flex flex-col">
        {accessOtherPlanDetails?.map((item, index) => (
          <AccessToOthersPlanItem
            key={index}
            className="mt-8"
            planDetails={item.otherPlanData}
            name={item.memberName}
            dob={item.dob}
          />
        ))}
      </Column>
    </Column>
  );
};
