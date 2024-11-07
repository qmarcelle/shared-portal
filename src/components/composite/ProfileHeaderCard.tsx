import { useLoginStore } from '@/app/login/stores/loginStore';
import { UserType } from '@/models/user_profile';
import { DEFAULT_LOGOUT_REDIRECT } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { IComponent } from '../IComponent';
import { ProfileHeaderCardItem } from '../composite/ProfileHeaderCardItem';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { useSideBarModalStore } from '../foundation/SideBarModal';
import { Spacer } from '../foundation/Spacer';

export interface ProfileHeaderCardProps extends IComponent {
  user: string;
  icon: JSX.Element;
}

export const ProfileHeaderCard = ({ user, icon }: ProfileHeaderCardProps) => {
  const { showSideBar, dismissModal } = useSideBarModalStore();
  const { signOut } = useLoginStore();
  const router = useRouter();
  const onSignOut = async () => {
    await signOut();
    dismissModal();
    router.replace(DEFAULT_LOGOUT_REDIRECT);
  };
  return (
    <div
      className="flex h-full secondary-bg-color2 text-white px-4 py-1"
      tabIndex={0}
      aria-label="Profile Card"
      onClick={() =>
        showSideBar({
          content: (
            <ProfileHeaderCardItem
              profiles={[
                {
                  id: '456',
                  name: 'Chris Hall',
                  dob: '01/01/1978',
                  type: UserType.Primary,
                },
                {
                  id: '457',
                  name: 'Robert Hall',
                  dob: '01/01/1943',
                  type: UserType.PersonalRepresentative,
                },
                {
                  id: '458',
                  name: 'Ellie Williams',
                  dob: '01/01/1943',
                  type: UserType.AuthorizedUser,
                },
              ]}
            />
          ),
          footer: (
            <section
              className="flex flex-row justify-center"
              style={{
                position: 'absolute',
                bottom: 0,
                padding: '10px',
                overflow: 'hidden',
              }}
            >
              <Column>
                <Divider />
                <Spacer size={16} />
                <Button
                  className="font-bold w-[288px] h-[40px] "
                  tabIndex={0}
                  label="Signout"
                  type="secondary"
                  id="signoutButton"
                  callback={() => onSignOut()}
                ></Button>
              </Column>
            </section>
          ),
        })
      }
    >
      {icon}
      <div className="hidden lg:block p-2">
        <span className="text-xs">My Profile</span>
        <p>{user}</p>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
