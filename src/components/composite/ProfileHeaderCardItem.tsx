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
  return (
    <Column>
      <section>
        <Column className="flex flex-col" onClick={onClick}>
          <section className="switchFilter">
            <UserSwitchFilter
              userProfiles={profiles}
              selectedUser={{
                id: '456',
                name: 'Chris Hall',
                dob: '11/03/2000',
                type: UserType.Primary,
              }}
              onSelectionChange={() => {}}
            />
            <Spacer size={32} />
          </section>
        </Column>
      </section>
    </Column>
  );
};
