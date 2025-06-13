import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import {
  isKatieBeckettEligible,
  isManageMyPolicyEligible,
  isOtherInsuranceEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';
import External from '../../../../public/assets/external.svg';

export interface ManageMyPlanProps extends IComponent {
  visibilityRules?: VisibilityRules;
}

export const ManageMyPlan = ({
  className,
  visibilityRules,
}: ManageMyPlanProps) => {
  const router = useRouter();

  let manageMyPlanDetails;

  // BlueCare + Katie Beckett members: Show Katie Beckett Banking Info only
  if (isKatieBeckettEligible(visibilityRules)) {
    manageMyPlanDetails = [
      {
        title: 'Katie Beckett Banking Info',
        body: 'Find and update your bank draft details for your plan here.',
        externalLink: false,
        url: '/member/myplan/katiebeckett',
      },
    ];
  }
  // Off-marketplace members: Show all three options per original story
  else {
    manageMyPlanDetails = [];

    // Always add "Report Other Health Insurance" for off-marketplace members
    if (isOtherInsuranceEligible(visibilityRules)) {
      manageMyPlanDetails.push({
        title: 'Report Other Health Insurance',
        body: 'Do you or anyone else on your plan have other insurance? Let us know so we can process your claims correctly.',
        externalLink: false,
        url: '/member/myplan/otherinsurance',
      });
    }

    // Add "Manage My Policy" if eligible
    // if (isManageMyPolicyEligible(visibilityRules)) {
    manageMyPlanDetails.push({
      title: 'Update Social Security Number',
      body: 'Add or update the Social Security Number associated with your plan.',
      externalLink: false,
      url: '/member/myplan/ssn',
    });
    if (isManageMyPolicyEligible(visibilityRules)) {
      manageMyPlanDetails.push({
        title: 'Manage My Policy',
        body: 'Change your plan benefits, update personal information, add/remove dependents, or cancel your policy.',
        externalLink: false,
        url: '/member/myplan/managepolicy',
      });
    }
  }

  return (
    <Card className={className}>
      <Column>
        <Header type="title-2" text="Manage My Plan" />
        <Column>
          {manageMyPlanDetails.map((items, index) =>
            items.externalLink ? (
              <>
                {' '}
                {/* for the external link image*/}
                <Spacer size={16} />
                <LinkRow
                  key={index}
                  label={items.title}
                  description={
                    <div className="body-1 flex flex-row">{items.body}</div>
                  }
                  divider={false}
                  icon={<Image src={External} alt="" />}
                  onClick={() => {
                    window.location.href = items.url;
                  }}
                />
                {index !== manageMyPlanDetails.length - 1 && <Divider />}
              </>
            ) : (
              <>
                <Spacer size={16} />
                <LinkRow
                  key={index}
                  label={items.title}
                  description={
                    <div className="body-1 flex flex-row">{items.body}</div>
                  }
                  divider={false}
                  onClick={() => {
                    router.push(items.url);
                  }}
                />
                {index !== manageMyPlanDetails.length - 1 && <Divider />}
              </>
            ),
          )}
        </Column>
      </Column>
    </Card>
  );
};
