import { UserProfile, UserType } from '@/models/user_profile';
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
              user.type === UserType.Primary
                ? 'My Profile'
                : isSelected
                  ? `viewing as ${user.type}`
                  : `view as ${user.type} `
            }
          />
          <Row className="justify-between">
            <Header
              text={user.name}
              type="title-3"
              className={`font-bold text-xl py-1 ${!isSelected ? 'primary-color' : ''}`}
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
            user.type === UserType.Primary
              ? 'My Profile'
              : `viewing as ${user.type || ''}`
          }
        />
        <Header text={user.name} type="title-3" className="font-bold p-1" />
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
      ,
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
  const userLinksMap = {
    [UserType.Primary]: [
      {
        label: 'All Profile Settings',
        className:
          'font-bold !flex primary-color underline underline-offset-3 title-3 ',
        icon: <Image src={parentPageArrowIcon} alt="link" />,
        url: '/profileSettings',
      },
      {
        label: 'Communication Settings',
        className:
          'font-bold primary-color body-bold body-1 manage-underline mt-4',
      },
      {
        label: 'Security Settings',
        className: 'font-bold primary-color body-bold body-1 manage-underline',
      },
      {
        label: 'Sharing & Permissions',
        className: 'font-bold primary-color body-bold body-1 manage-underline',
      },
    ],
    [UserType.PersonalRepresentative]: [
      {
        label: 'All Profile Settings',
        className:
          'font-bold !flex primary-color underline underline-offset-3 title-3',
        icon: <Image src={parentPageArrowIcon} alt="link" />,
        url: '/profileSettings',
      },

      {
        label: 'Sharing & Permissions',
        className:
          'font-bold primary-color body-bold body-1 mt-4 manage-underline',
      },
    ],
    [UserType.AuthorizedUser]: [],
  };
  const userLinks = selected.type
    ? userLinksMap[selected.type]
    : userLinksMap[UserType.AuthorizedUser];
  return (
    <section>
      <RichDropDown<UserProfile>
        headBuilder={(val) => <UserSwitchHead user={val} />}
        itemData={userProfiles}
        itemsBuilder={(data) => (
          <UserProfileTile user={data} isSelected={selected.id === data.id} />
        )}
        selected={selected}
        onSelectItem={(val) => setSelected(val)}
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
            />
            <Spacer size={8} />
            {link.label === 'All Profile Settings' && <Divider />}
          </>
        ))}
      </Column>
    </section>
  );
};
