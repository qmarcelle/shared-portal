import { useLoginStore } from '@/app/login/stores/loginStore';
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
      onClick={() =>
        showSideBar({
          content: (
            <ProfileHeaderCardItem
              profileSetting="All Profile Settings"
              communicationSetting="Communication Settings"
              securitySetting="Security Settings"
              sharingAndPermissions="Sharing & Permissions"
              profiles={[
                {
                  id: '456',
                  name: 'Chris Hall',
                  dob: '11/03/2000',
                  type: 'Primary',
                },
                {
                  id: '457',
                  name: 'Chris Hall',
                  dob: '11/03/2000',
                  type: 'Primary',
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
        <span className="text-xs">Primary Profile</span>
        <p>{user}</p>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
