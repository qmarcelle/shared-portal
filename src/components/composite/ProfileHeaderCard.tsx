import { useLoginStore } from '@/app/login/stores/loginStore';
import { AnalyticsData } from '@/models/app/analyticsData';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { googleAnalytics } from '@/utils/analytics';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { DEFAULT_LOGOUT_REDIRECT } from '@/utils/routes';
import { useRouter } from 'next/navigation';
import { IComponent } from '../IComponent';
import { ProfileHeaderCardItem } from '../composite/ProfileHeaderCardItem';
import { Button } from '../foundation/Button';
import { Column } from '../foundation/Column';
import { useSideBarModalStore } from '../foundation/SideBarModal';

export interface ProfileHeaderCardProps extends IComponent {
  icon: JSX.Element;
  profiles: UserProfile[];
}

export const ProfileHeaderCard = ({
  icon,
  profiles,
}: ProfileHeaderCardProps) => {
  const { showSideBar, dismissModal } = useSideBarModalStore();
  const { signOut } = useLoginStore();
  const router = useRouter();
  const onSignOut = async () => {
    await signOut();
    dismissModal();
    logOutAnalytics();
    router.replace(DEFAULT_LOGOUT_REDIRECT);
    router.refresh();
  };
  const logOutAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'Signout',
      click_url: '',
      event: 'logout',
      content_type: undefined,
      element_category: 'Link Click',
      page_section: 'header',
    };
    googleAnalytics(analytics);
  };

  const selectedProfile = profiles.find((item) => item.selected == true);

  const getSideBarContentModal = () => {
    const analytics: AnalyticsData = {
      click_text: 'Member Name',
      click_url: window.location.href,
      element_category: 'profile',
      action: 'expand',
      event: 'select_content',
      content_type: 'select',
      page_section: 'header',
      selection_type: 'tile',
    };
    googleAnalytics(analytics);
    showSideBar({
      content: (
        <ProfileHeaderCardItem profiles={profiles} onClick={dismissModal} />
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
    });
  };

  return (
    <div
      className="flex h-full secondary-bg-color2 text-white px-4 py-1 hover:bg-info focus:bg-info focus:mr-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:h-[90%] "
      tabIndex={0}
      aria-label="Profile Card"
      onClick={() => getSideBarContentModal()}
    >
      {icon}
      <div className="hidden lg:block p-2">
        <span className="text-xs">
          {[UserRole.MEMBER, UserRole.NON_MEM].includes(selectedProfile!.type)
            ? 'My Profile:'
            : 'Viewing as:'}
        </span>
        <p>
          {toPascalCase(
            `${selectedProfile!.firstName} ${selectedProfile!.lastName}`,
          )}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeaderCard;
