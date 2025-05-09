import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Spacer } from '@/components/foundation/Spacer';
import React from 'react';

import {
  isBlueCareEligible,
  isManageMyPolicyEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';

export interface ManageMyPlanProps extends IComponent {
  visibilityRules?: VisibilityRules;
}

export const ManageMyPlan = ({
  className,
  visibilityRules,
}: ManageMyPlanProps) => {
  let manageMyPlanDetails;
  if (isBlueCareEligible(visibilityRules))
    manageMyPlanDetails = [
      {
        title: 'Katie Beckett Banking Info',
        body: 'Find and update your bank draft details for your plan here.',
        externalLink: false,
        url: 'myPlan/katieBeckettBankingInfo',
      },
    ];
  else if (isManageMyPolicyEligible(visibilityRules))
    manageMyPlanDetails = [
      {
        title: 'Report Other Health Insurance',
        body: 'Do you or anyone else on your plan have other insurance? Let us know so we can process your claims correctly.',
        externalLink: false,
        url: '/reportOtherHealthInsurance',
      },
      {
        title: 'Update Social Security Number',
        body: 'Add or update the Social Security Number associated with your plan.',
        externalLink: false,
        url: '/myPlan/updateSocialSecurityNumber',
      },
      {
        title: 'Manage My Policy',
        body: 'Change your plan benefits, update personal information, add/remove dependents, or cancel your policy.',
        externalLink: false,
        url: '/myPlan/manageMyPolicy',
      },
    ];
  else
    manageMyPlanDetails = [
      {
        title: 'Report Other Health Insurance',
        body: 'Do you or anyone else on your plan have other insurance? Let us know so we can process your claims correctly.',
        externalLink: false,
        url: '/reportOtherHealthInsurance',
      },
      {
        title: 'Update Social Security Number',
        body: 'Add or update the Social Security Number associated with your plan.',
        externalLink: false,
        url: '/myPlan/updateSocialSecurityNumber',
      },
      {
        title: 'Enroll in a Health Plan',
        body: "All our plans include a wide choice of doctors and healthy, money-saving extras. We'll walk you through your options and help you choose the right one for your family.",
        externalLink: true,
        url: 'url',
      },
    ];

  return (
    <Card className={className}>
      <Column>
        <Header type="title-2" text="Manage My Plan" />
        <Column>
          {manageMyPlanDetails.map((items, index) =>
            items.externalLink ? (
              <React.Fragment key={index}>
                {/* for the external link image*/}
                <Spacer size={16} />
                <LinkRow
                  label={items.title}
                  description={
                    <div className="body-1 flex flex-row">{items.body}</div>
                  }
                  divider={false}
                  icon={<img src="/assets/external.svg" alt="link" />}
                  onClick={() => {
                    window.location.href = items.url;
                  }}
                />
                {index !== manageMyPlanDetails.length - 1 && <Divider />}
              </React.Fragment>
            ) : (
              <React.Fragment key={index}>
                <Spacer size={16} />
                <LinkRow
                  label={items.title}
                  description={
                    <div className="body-1 flex flex-row">{items.body}</div>
                  }
                  divider={false}
                  onClick={() => {
                    window.location.href = items.url;
                  }}
                />
                {index !== manageMyPlanDetails.length - 1 && <Divider />}
              </React.Fragment>
            ),
          )}
        </Column>
      </Column>
    </Card>
  );
};
