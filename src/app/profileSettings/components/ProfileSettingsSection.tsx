import { InfoCard } from '@/components/composite/InfoCard';
import { Column } from '@/components/foundation/Column';
import {
  communicationSettingsIcon,
  securityIcon,
  sharePermissionsIcon,
} from '@/components/foundation/Icons';

export const ProfileSettingsSection = () => {
  const profileSettingDetails = [
    {
      label: 'Communication Settings',
      description: 'Update your alert preferences.',
      iconName: communicationSettingsIcon,
      link: '/communicationSettings',
    },
    {
      label: 'Security Settings',
      description: 'Change your password and edit your account security.',
      iconName: securityIcon,
      link: '/security',
    },
    {
      label: 'Sharing & Permissions',
      description: 'View or edit access to plan information.',
      iconName: sharePermissionsIcon,
      link: '/sharingPermissions',
    },
  ];

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
