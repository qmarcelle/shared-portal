import { AccessOnMyPlanDetails } from '@/app/(protected)/(common)/member/accessOthersInformation/models/accessonmyplan_details';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ReactElement } from 'react';
import { AccessOnMyPlanItem } from './AccessOnMyPlanItem';

interface AccessOnMyPlanDropDownProps extends IComponent {
  accessOnMyPlanDetails: AccessOnMyPlanDetails[];
  header?: ReactElement;
  subHeader?: ReactElement;
  planType?: ReactElement;
  infoIcon: boolean;
}

export const AccessOnMyPlanComponent = ({
  accessOnMyPlanDetails,
  header,
  subHeader,
  planType,
  infoIcon,
}: AccessOnMyPlanDropDownProps) => {
  return (
    <Column className="flex flex-col">
      {header}
      {subHeader && (
        <div>
          {' '}
          <Spacer size={16} />
          {subHeader}
          <Spacer size={32} />
        </div>
      )}
      {planType && <div>{planType}</div>}
      <Spacer size={32} />
      <Column className="flex flex-col">
        {accessOnMyPlanDetails.map((item, index) => (
          <AccessOnMyPlanItem
            key={index}
            className="mb-4"
            memberName={item.memberName}
            DOB={item.DOB}
            isOnline={item.isOnline}
            infoButton={infoIcon}
          />
        ))}
      </Column>
    </Column>
  );
};
