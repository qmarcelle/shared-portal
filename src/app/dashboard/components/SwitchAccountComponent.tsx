import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { UserProfile } from '@/models/user_profile';
import { switchUser } from '@/userManagement/actions/switchUser';
import { useRouter } from 'next/navigation';
import { SwitchAccountItem } from './SwitchAccountItem';

interface SwitchAccountComponentProps extends IComponent {
  switchAccountDetails: UserProfile[];
}

export const SwitchAccountComponent = ({
  switchAccountDetails,
}: SwitchAccountComponentProps) => {
  const router = useRouter();

  async function switchProfile(userId: string) {
    await switchUser(userId);
    if (window.chatConfig) {
      window.location.reload();
    } else {
      router.refresh();
    }
  }

  return (
    <Card className="large-section">
      <Column className="flex flex-col">
        <Header
          type="title-2"
          text="Switch Account"
          ariaLabel="Switch Account"
        />
        <TextBox
          text="Select the account to switch to:"
          ariaLabel="Select the account to switch to:"
        />
        <Spacer size={16} />
        <Column className="flex flex-col">
          {switchAccountDetails.map((item, index) => (
            <SwitchAccountItem
              key={index}
              className="mb-4"
              memberName={`${item.firstName} ${item.lastName}`}
              DOB={item.dob}
              id={item.id}
              role={item.type}
              onChange={(val) => switchProfile(val)}
            />
          ))}
        </Column>
      </Column>
    </Card>
  );
};
