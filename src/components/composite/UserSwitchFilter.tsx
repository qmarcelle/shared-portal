import { UserProfile } from '@/models/user_profile';
import Image from 'next/image';
import { useState } from 'react';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { switchFilterIcon } from '../foundation/Icons';
import { RichDropDown } from '../foundation/RichDropDown';
import { Row } from '../foundation/Row';
import { TextBox } from '../foundation/TextBox';

const UserProfileTile = ({ user }: { user: UserProfile }) => {
  return (
    <Column className="grow">
      {user.type == 'Primary' && (
        <TextBox type="body-2" text="Primary Profile" />
      )}
      <Header text={user.name} type="title-3" className="font-bold" />
      <TextBox type="body-1" text={`DOB: ${user.dob}`} />
    </Column>
  );
};

const UserSwitchHead = ({ user }: { user: UserProfile }) => {
  return (
    <Row className="p-4 items-center">
      <UserProfileTile user={user} />
      <Image alt="switch" className="size-5 head-icon" src={switchFilterIcon} />
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

  return (
    <RichDropDown<UserProfile>
      headBuilder={(val) => <UserSwitchHead user={val} />}
      itemData={userProfiles}
      itemsBuilder={(data) => <UserProfileTile user={data} />}
      selected={selected}
      onSelectItem={(val) => setSelected(val)}
    />
  );
};
