import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { LinkRow } from '@/components/foundation/LinkRow';
import { UserRole } from '@/userManagement/models/sessionUser';
import { checkPersonalRepAccess } from '@/utils/getRole';

export type SharingAndPermissionsInfoProps = {
  userRole: UserRole | undefined;
};

export const SharingAndPermissionsInfo = ({
  userRole,
}: SharingAndPermissionsInfoProps) => {
  return (
    <Card className="large-section">
      <Column className="flex flex-col">
        <LinkRow
          label="Share My Information"
          link="/shareMyInformation"
          description={
            <div className="body-1 flex flex-row">
              Control how your plan information is shared with your family or
              individuals outside your plan.
            </div>
          }
          divider={true}
        />

        {checkPersonalRepAccess(userRole) && (
          <LinkRow
            label="Access Others' Information"
            link="/accessOthersInformation"
            description={
              <div className="body-1 flex flex-row">
                View or request access to others&apos; plan information.
              </div>
            }
            divider={true}
          />
        )}
        {checkPersonalRepAccess(userRole) && (
          <LinkRow
            label="Personal Representative Access"
            link="/personalRepresentativeAccess"
            description={
              <div className="body-1 flex flex-row">
                A personal representative is an individual with the legal
                authority to make decisions for others, such as minor dependent
                or other dependent individual.
              </div>
            }
            divider={true}
          />
        )}
        <LinkRow
          label="Third Party Sharing"
          link="/thirdPartySharing"
          description={
            <div className="body-1 flex flex-row">
              View the apps and websites you&apos;ve shared your plan
              information with.
            </div>
          }
          divider={false}
        />
        {/* US-33923 Removing Health Info Transfer Request */}
        {/* <LinkRow
          label="Health Information Transfer Request"
          description={
            <div className="body-1 flex flex-row">
              Transfer your health info (not including claim or Explanation of
              Benefits info) from your previous health insurer.
            </div>
          }
          divider={false}
        /> */}
      </Column>
    </Card>
  );
};
