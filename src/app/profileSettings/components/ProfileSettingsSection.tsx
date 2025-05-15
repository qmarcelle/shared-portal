import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import {
  communicationSettingsIcon,
  securityIcon,
  sharePermissionsIcon,
} from '@/components/foundation/Icons';
import { UserRole } from '@/userManagement/models/sessionUser';
import { checkPersonalRepAccess } from '@/utils/getRole';
import { isCommunicationSettingsEligible } from '@/visibilityEngine/computeVisibilityRules';
import { VisibilityRules } from '@/visibilityEngine/rules';

export type ProfileSettingsSectionProps = {
  visibilityRules?: VisibilityRules;
  userRole: UserRole | undefined;
};

export const ProfileSettingsSection = ({
  visibilityRules,
  userRole,
}: ProfileSettingsSectionProps) => {
  let profileSettingDetails;
  if (isCommunicationSettingsEligible(visibilityRules)) {
    profileSettingDetails = [
      {
        label: 'Communication Settings',
        description: 'Update your alert preferences.',
        iconName: communicationSettingsIcon,
        link: '/member/profile/communication',
      },
      {
        label: 'Security Settings',
        description: 'Change your password and edit your account security.',
        iconName: securityIcon,
        link: '/member/profile/security',
      },

      {
        label: 'Sharing & Permissions',
        description: 'View or edit access to plan information.',
        iconName: sharePermissionsIcon,
        link: '/member/profile/accountsharing',
      },
    ];
  } else {
    profileSettingDetails = [
      {
        label: 'Sharing & Permissions',
        description: 'View or edit access to plan information.',
        iconName: sharePermissionsIcon,
        link: '/member/profile/accountsharing',
      },
    ];
  }

  // Filter out settings based on user role
  if (userRole && !checkPersonalRepAccess(userRole)) {
    profileSettingDetails = profileSettingDetails.filter(
      (profileSetting) =>
        profileSetting.label !== 'Communication Settings' &&
        profileSetting.label !== 'Security Settings',
    );
  }

  return (
    <Column>
      {profileSettingDetails.map((item) => {
        return (
          <InfoCard
            key={item.label}
            label={item.label}
            icon={item.iconName}
            body={item.description}
            link={item.link}
          />
        );
      })}
    </Column>
  );
};
