import { Card } from '@/components/foundation/Card';
import { ListRow } from '@/components/foundation/ListRow';
import { Spacer } from '@/components/foundation/Spacer';
import { ToolTip } from '@/components/foundation/Tooltip';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import Image from 'next/image';
import infoIcon from '../../../../public/assets/info.svg';

interface LoginInfoComponentProps {
  username: string;
}

export const LoginInfoComponent = ({ username }: LoginInfoComponentProps) => {
  // Disabling EsLint Rules for this method for 10/16 release due to iFrame.
  // To Do: Enable it for 12/16 release
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const changeMyPasswordAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'change my password',
      click_url: process.env.NEXT_PUBLIC_PASSWORD_RESET,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };
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
              <Image className="icon" src={infoIcon} alt="" tabIndex={0} />
            </ToolTip>
          }
        />
        <p className="m-2">{username}</p>
        {/* Commenting out for 10/16 release due to iFrame. 
        To Do: Enable it for 12/16 release
        <Spacer size={24} />
        <Divider />
        <Spacer size={16} />
        <LinkRow
          label="Change My Password"
          onClick={() => {
            window.location.href = process.env.NEXT_PUBLIC_PASSWORD_RESET ?? '';
            changeMyPasswordAnalytics();
          }}
        /> */}
      </div>
    </Card>
  );
};
