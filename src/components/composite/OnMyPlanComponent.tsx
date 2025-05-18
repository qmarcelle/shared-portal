import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { OnMyPlanDetails } from '@/models/onmyplan_details';
import { ReactElement } from 'react';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { OnMyPlanItem } from './OnMyPlanItem';

interface OnMyPlanDropDownProps extends IComponent {
  onMyPlanDetails: OnMyPlanDetails[];
  header?: ReactElement;
  subHeader?: ReactElement;
  planType?: ReactElement;
  infoIcon: boolean;
  allowUpdates?: boolean;
}

export const OnMyPlanComponent = ({
  onMyPlanDetails,
  header,
  subHeader,
  planType,
  infoIcon,
  allowUpdates = true,
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
        {onMyPlanDetails.map((item, index) => (
          <OnMyPlanItem
            key={index}
            className="mb-4"
            memberName={item.memberName}
            DOB={item.DOB}
            sharingType={item.sharingType}
            isMinor={item.isMinor}
            infoButton={infoIcon}
            requestorType={item.requestorType}
            targetType={item.targetType}
            medicalEffectiveDate={item.medicalEffectiveDate}
            dentalEffectiveDate={item.dentalEffectiveDate}
            visionEffectiveDate={item.visionEffectiveDate}
            allowUpdates={allowUpdates}
          />
        ))}
      </Column>
      <Spacer size={32} />
      <AppLink label="View Benefits & Coverage" />
    </Column>
  );
};
