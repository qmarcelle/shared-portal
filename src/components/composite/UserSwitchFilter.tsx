import { AnalyticsData } from '@/models/app/analyticsData';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { googleAnalytics } from '@/utils/analytics';
import { computeRoleNameFromType } from '@/utils/role_name_converter';
import Image from 'next/image';
import { useState } from 'react';
import { AppLink } from '../foundation/AppLink';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { Header } from '../foundation/Header';
import {
  checkGreenIcon,
  parentPageArrowIcon,
  rightIcon,
  switchFilterIcon,
} from '../foundation/Icons';
import { RichDropDown } from '../foundation/RichDropDown';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

const UserProfileTile = ({
  user,
  isSelected,
}: {
  user: UserProfile;
  isSelected: boolean;
}) => {
  return (
    <Card
      type="elevated"
      className={`p-4 ${isSelected ? 'selected' : ''} app-base-font-color min-w-[100%]`}
    >
      <Column>
        <Column className="justify-between">
          <TextBox
            type="body-2"
            text={
              user.type === UserRole.MEMBER || user.type === UserRole.NON_MEM
                ? 'My Profile'
                : isSelected
                  ? `Viewing as ${computeRoleNameFromType(user.type)}`
                  : `View as ${computeRoleNameFromType(user.type)}`
            }
          />
          <Row className="justify-between">
            <Header
              text={`${user.firstName} ${user.lastName}`}
              type="title-3"
              className={`font-bold text-xl py-1 ${isSelected ? '' : 'primary-color'}`}
            />
            <Image
              alt="selected"
              className="size-5 m-[2px]"
              src={isSelected ? checkGreenIcon : rightIcon}
            />
          </Row>

          <TextBox
            type="body-1"
            text={`DOB: ${user.dob}`}
            className="text-base"
          />
        </Column>
      </Column>
    </Card>
  );
};

const UserSwitchHead = ({ user }: { user: UserProfile }) => {
  return (
    <Row className="px-4 py-2 items-center w-auto h-[105px]">
      <Column className="grow">
        <TextBox
          type="body-2"
          className="font-light"
          text={
            user.type === UserRole.MEMBER || user.type === UserRole.NON_MEM
              ? 'My Profile'
              : `Viewing as ${computeRoleNameFromType(user.type)}`
          }
        />
        <Header
          text={`${user.firstName} ${user.lastName}`}
          type="title-3"
          className="font-bold primary-color"
        />
        <TextBox
          type="body-1"
          text={`DOB: ${user.dob}`}
          className="font-light"
        />
      </Column>
      {user.id.length > 1 && (
        <Image
          alt="switch"
          className="size-5 head-icon"
          src={switchFilterIcon}
        />
      )}
    </Row>
  );
};

interface UserSwitchFilterProps {
  userProfiles: UserProfile[];
  selectedUser: UserProfile;
  onSelectionChange: (val: UserProfile) => void;
}

export const UserSwitchFilter = ({
  userProfiles,
  selectedUser,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelectionChange,
}: UserSwitchFilterProps) => {
  const [selected, setSelected] = useState(selectedUser);
  function changeSelection(val: UserProfile) {
    onSelectionChange(val);
    setSelected(val);
  }
  const userLinksMap = {
    [UserRole.MEMBER]: [
      {
        label: 'All Profile Settings',
        className:
          'font-bold !flex primary-color underline underline-offset-3 title-3 ',
        icon: <Image src={parentPageArrowIcon} alt="link" />,
        url: '/member/profile',
      },
      {
        label: 'Communication Settings',
        className:
          'font-bold primary-color body-bold body-1 manage-underline mt-4',
        url: '/member/profile/communication',
      },
      {
        label: 'Security Settings',
        className: 'font-bold primary-color body-bold body-1 manage-underline',
        url: '/member/profile/security',
      },
    ],
    [UserRole.PERSONAL_REP]: [
      {
        label: 'All Profile Settings',
        className:
          'font-bold !flex primary-color underline underline-offset-3 title-3',
        icon: <Image src={parentPageArrowIcon} alt="link" />,
        url: '/member/profile',
      },

      {
        label: 'Sharing & Permissions',
        className:
          'font-bold primary-color body-bold body-1 mt-4 manage-underline',
        url: '/member/profile/accountsharing',
      },
    ],
    [UserRole.AUTHORIZED_USER]: [],
    [UserRole.NON_MEM]: [],
  };
  const userLinks = selected.type
    ? userLinksMap[selected.type]
    : userLinksMap[UserRole.AUTHORIZED_USER];
  const getAnalyticsData = (label: string) => {
    const analytics: AnalyticsData = {
      click_text: label.toLocaleLowerCase(),
      click_url: window.location.href,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };
  return (
    <section>
      <RichDropDown<UserProfile>
        headBuilder={(val) => <UserSwitchHead user={val} />}
        itemData={userProfiles}
        itemsBuilder={(data) => (
          <UserProfileTile user={data} isSelected={selected.id === data.id} />
        )}
        selected={selected}
        onSelectItem={(val) => changeSelection(val)}
        showSelected={false}
        divider={false}
        className="myProfile"
      />
      <Spacer size={24} />
      <Column>
        {userLinks.map((link) => (
          <>
            <AppLink
              key={link.label}
              className={link.className}
              label={link.label}
              icon={link.icon}
              url={link.url}
              callback={() => getAnalyticsData(link.label) ?? undefined}
            />
            <Spacer size={8} />
            {link.label === 'All Profile Settings' && <Divider />}
          </>
        ))}
      </Column>
    </section>
  );
};
