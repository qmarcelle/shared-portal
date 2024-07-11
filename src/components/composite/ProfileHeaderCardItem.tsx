import { UserProfile } from '@/models/user_profile';
import Image from 'next/image';
import { IComponent } from '../IComponent';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { parentPageArrowIcon } from '../foundation/Icons';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { Title } from '../foundation/Title';
import { UserSwitchFilter } from './UserSwitchFilter';

interface ProfileHeaderCardItemProps extends IComponent {
  profileSetting: string;
  communicationSetting: string;
  securitySetting: string;
  sharingAndPermissions: string;
  icon?: JSX.Element;
  profiles: UserProfile[];
}

export const ProfileHeaderCardItem = ({
  profileSetting,
  communicationSetting,
  securitySetting,
  sharingAndPermissions,
  icon = <Image src={parentPageArrowIcon} alt="link" />,
  onClick,
  profiles,
}: ProfileHeaderCardItemProps) => {
  return (
    <Column>
      <section>
        <Column className="flex flex-col" onClick={onClick}>
          <section>
            <UserSwitchFilter
              userProfiles={profiles}
              selectedUser={{
                id: '456',
                name: 'Chris Hall',
                dob: '11/03/2000',
                type: 'Primary',
              }}
              onSelectionChange={() => {}}
            />
            <Spacer size={32} />
            <a href={'/profileSettings'}>
              <Title
                className="!font-bold primary-color underline underline-offset-3 title-3 "
                text={profileSetting}
                suffix={icon}
              />
            </a>
            <Spacer size={24} />
            <Divider className="w-[288px] h-[1px]" />
            <Spacer size={24} />
            <TextBox
              type="body-1"
              className="font-bold primary-color "
              text={communicationSetting}
            />
            <Spacer size={16} />
            <TextBox
              type="body-1"
              className="font-bold primary-color"
              text={securitySetting}
            />
            <Spacer size={16} />
            <TextBox
              type="body-1"
              className="font-bold primary-color "
              text={sharingAndPermissions}
            />
          </section>
        </Column>
      </section>
    </Column>
  );
};
