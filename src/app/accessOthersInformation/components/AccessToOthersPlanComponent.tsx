import { Column } from '@/components/foundation/Column';
import { IComponent } from '@/components/IComponent';
import { AccessStatus } from '@/models/app/getSharePlanDetails';
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
}: AccessToOthersPlanComponentProps) => {
  return (
    <Column className="flex flex-col">
      <Column className="flex flex-col">
        {accessOtherPlanDetails?.map(
          (item, index) =>
            item.accessStatus &&
            item.accessStatus !== AccessStatus.NoAccess && (
              <AccessToOthersPlanItem
                key={index}
                className="mt-8"
                planDetails={item.otherPlanData}
                name={item.memberName}
                dob={item.dob}
              />
            ),
        )}
      </Column>
    </Column>
  );
};
