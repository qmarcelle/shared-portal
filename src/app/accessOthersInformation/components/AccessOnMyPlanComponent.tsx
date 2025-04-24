import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ShareMyPlanDetails } from '@/models/app/getSharePlanDetails';
import { ReactElement, useState } from 'react';
import { AccessOnMyPlanItem } from './AccessOnMyPlanItem';

interface AccessOnMyPlanDropDownProps extends IComponent {
  accessOnMyPlanDetails: ShareMyPlanDetails[] | null;
  loggedInMemberType: string | null;
  header?: ReactElement;
  subHeader?: ReactElement;
  infoIcon: boolean;
}

export const AccessOnMyPlanComponent = ({
  accessOnMyPlanDetails,
  header,
  subHeader,
  loggedInMemberType,
  infoIcon,
}: AccessOnMyPlanDropDownProps) => {
  const [memberAccessList, setMemberAccessList] = useState(
    accessOnMyPlanDetails,
  );
  function updateMemberAccessToPending(memberCk: string) {
    const member = memberAccessList?.find((item) => item.memberCk === memberCk);

    if (member != undefined) {
      member.accessStatusIsPending = true;
      setMemberAccessList([...memberAccessList!]);
    }
  }

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
        {memberAccessList?.map((item, index) => (
          <AccessOnMyPlanItem
            onRequestSuccessCallBack={() =>
              updateMemberAccessToPending(item.memberCk)
            }
            key={index}
            memberDetails={item}
            isOnline={item.isOnline}
            infoButton={infoIcon}
            loggedInMemberType={loggedInMemberType}
            inviteStatus={item.accessStatusIsPending!}
          />
        ))}
      </Column>
    </Column>
  );
};
