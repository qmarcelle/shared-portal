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
  infoIcon: boolean;
  allowUpdates?: boolean;
}

export const ShareMyPlanComponent = ({
  ShareMyPlanDetails,
  header,
  subHeader,
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
      <Column className="flex flex-col">
        {ShareMyPlanDetails?.map((item, index) => (
          <OnMyPlanItem
            key={index}
            className="mb-4"
            onMyPlanData={item}
            infoButton={infoIcon}
            sharingType={item.accessStatus}
            medicalEffectiveDate={''}
            dentalEffectiveDate={''}
            visionEffectiveDate={''}
            allowUpdates={allowUpdates}
            isGATrackEligible={true}
            analyticsEvent={'select_content'}
            selectionType={'modal'}
            elementCategory={'On My Plan'}
          />
        ))}
      </Column>
    </Column>
  );
};
