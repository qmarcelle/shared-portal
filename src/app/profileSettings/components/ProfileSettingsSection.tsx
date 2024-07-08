import { Column } from '@/components/foundation/Column';
import {
  communicationSettingsIcon,
  connectAccountsIcon,
  securityIcon,
  sharePermissionsIcon,
} from '@/components/foundation/Icons';
import { InfoCard } from '../../../components/composite/InfoCard';

export const ProfileSettingsSection = () => {
  const profileSettingDetails = [
    {
      label: 'Communication Settings',
      description: 'Update your alert preferences.',
      iconName: communicationSettingsIcon,
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
    },
    {
      label: 'Connect Accounts',
      description: 'Connect multiple health plan accounts into one.',
      iconName: connectAccountsIcon,
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
