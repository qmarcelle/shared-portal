import { Card } from '@/components/foundation/Card';
import { Divider } from '@/components/foundation/Divider';
import { LinkRow } from '@/components/foundation/LinkRow';
import { ListRow } from '@/components/foundation/ListRow';
import { Spacer } from '@/components/foundation/Spacer';
import { ToolTip } from '@/components/foundation/Tooltip';
import Image from 'next/image';
import infoIcon from '../../../../public/assets/info.svg';

interface LoginInfoComponentProps {
  username: string;
}

export const LoginInfoComponent = ({ username }: LoginInfoComponentProps) => {
  return (
    <Card className="small-section">
      <div className="flex flex-col">
        <h2 className="title-2">Login Information</h2>
        <Spacer size={16} />
        <p className="body-1">
          Below is your username and a link to change your password.
        </p>
        <Spacer size={32} />
        <ListRow
          label={<p className="font-bold">Username</p>}
          isJustifyBetween={false}
          icon={
            <ToolTip
              showTooltip={true}
              className="flex flex-row justify-center items-center toptooltip pl-2"
              label="To change your username, you will need to delete your registered account and create a new account. This will not affect your health plan information."
            >
              <Image className="icon" src={infoIcon} alt="Info" />
            </ToolTip>
          }
        />
        <p className="m-2">{username}</p>
        <Spacer size={24} />
        <Divider />
        <Spacer size={16} />
        <LinkRow
          label="Change My Password"
          onClick={() => {
            window.location.href = process.env.NEXT_PUBLIC_PASSWORD_RESET ?? '';
          }}
        />
      </div>
    </Card>
  );
};
