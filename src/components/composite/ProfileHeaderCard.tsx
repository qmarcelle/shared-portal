import { profileData } from '@/actions/profileData';
import { useLoginStore } from '@/app/login/stores/loginStore';
import { UserProfile, UserType } from '@/models/user_profile';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { DEFAULT_LOGOUT_REDIRECT } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { IComponent } from '../IComponent';
import { ProfileHeaderCardItem } from '../composite/ProfileHeaderCardItem';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { useSideBarModalStore } from '../foundation/SideBarModal';

export interface ProfileHeaderCardProps extends IComponent {
  icon: JSX.Element;
}

export const ProfileHeaderCard = ({ icon }: ProfileHeaderCardProps) => {
  const { showSideBar, dismissModal } = useSideBarModalStore();
  const { signOut } = useLoginStore();
  const router = useRouter();
  const onSignOut = async () => {
    await signOut();
    dismissModal();
    router.replace(DEFAULT_LOGOUT_REDIRECT);
  };
  const [members, setMembers] = useState<UserProfile>({
    id: '',
    name: '',
    dob: '',
  });
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    (async () => {
      try {
        const memberDetails = await profileData();
        setMembers(memberDetails);
      } catch (err) {
        console.error('ProfileData Failure ');
      }
    })();
  }, []);
  return (
    <div
      className="flex h-full secondary-bg-color2 text-white px-4 py-1 hover:bg-info focus:bg-info focus:mr-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:h-[90%] "
      tabIndex={0}
      aria-label="Profile Card"
      onClick={() =>
        showSideBar({
          content: (
            <ProfileHeaderCardItem
              profiles={[
                {
                  id: members.id,
                  name: `${toPascalCase(members.name)}`,
                  dob: members.dob,
                  type: UserType.Primary,
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
                overflow: 'hidden',
                width: '100%',
              }}
            >
              <Column className="w-full border-t border-gray-300 border-t-[1px]">
                <Button
                  className="font-bold w-[90%] md:w-[288px] h-[40px] m-4"
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
        <p>{toPascalCase(members.name)}</p>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
