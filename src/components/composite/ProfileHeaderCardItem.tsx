import { UserProfile } from '@/models/user_profile';
import { switchUser } from '@/userManagement/actions/switchUser';
import { usePathname, useRouter } from 'next/navigation';
import { IComponent } from '../IComponent';
import { Column } from '../foundation/Column';
import { Spacer } from '../foundation/Spacer';
import { UserSwitchFilter } from './UserSwitchFilter';

interface ProfileHeaderCardItemProps extends IComponent {
  profiles: UserProfile[];
}

export const ProfileHeaderCardItem = ({
  onClick,
  profiles,
}: ProfileHeaderCardItemProps) => {
  const router = useRouter();
  const path = usePathname();
  const selectedUser = profiles.find((item) => item.selected == true)!;

  async function switchProfile(userId: string) {
    if (selectedUser.id == userId) {
      onClick!();
      return;
    }
    await switchUser(userId);
    if (path.includes('/dashboard') == false) {
      router.replace('/dashboard');
    }
    router.refresh();
    onClick!();
  }

  return (
    <Column>
      <section>
        <Column className="flex flex-col">
          <section className="switchFilter">
            <UserSwitchFilter
              userProfiles={profiles}
              selectedUser={selectedUser}
              onSelectionChange={(val) => {
                switchProfile(val.id);
              }}
            />
            <Spacer size={32} />
          </section>
        </Column>
      </section>
    </Column>
  );
};
