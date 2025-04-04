import { OnMyPlanItem } from '@/components/composite/OnMyPlanItem';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ShareMyPlanDetails } from '@/models/app/getSharePlanDetails';
import { ReactElement } from 'react';

interface OnMyPlanDropDownProps extends IComponent {
  ShareMyPlanDetails: ShareMyPlanDetails[] | null;
  header?: ReactElement;
  subHeader?: ReactElement;
  planType?: ReactElement;
  infoIcon: boolean;
}

export const ShareMyPlanComponent = ({
  ShareMyPlanDetails,
  header,
  subHeader,
  planType,
  infoIcon,
}: OnMyPlanDropDownProps) => {
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
        {ShareMyPlanDetails?.map((item, index) => (
          <OnMyPlanItem
            key={index}
            className="mb-4"
            memberName={item.memberName}
            DOB={item.DOB}
            infoButton={infoIcon}
            sharingType={item.accessStatus}
            isMinor={item.isMinor}
            targetType={item.roleType}
          />
        ))}
      </Column>
    </Column>
  );
};
