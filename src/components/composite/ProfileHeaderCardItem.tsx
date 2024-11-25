import { UserProfile, UserType } from '@/models/user_profile';
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
  const selectedUser = {
    id: profiles[0]?.id || '',
    name: profiles[0]?.name || '',
    dob: profiles[0]?.dob || '',
    type: UserType.Primary,
  };

  return (
    <Column>
      <section>
        <Column className="flex flex-col" onClick={onClick}>
          <section className="switchFilter">
            <UserSwitchFilter
              userProfiles={profiles}
              selectedUser={selectedUser}
              onSelectionChange={() => {}}
            />
            <Spacer size={32} />
          </section>
        </Column>
      </section>
    </Column>
  );
};
