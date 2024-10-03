import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { SwitchAccountDetails } from '../models/switch_Account_detail';
import { SwitchAccountItem } from './SwitchAccountItem';

interface SwitchAccountComponentProps extends IComponent {
  switchAccountDetails: SwitchAccountDetails[];
}

export const SwitchAccountComponent = ({
  switchAccountDetails,
}: SwitchAccountComponentProps) => {
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
              memberName={item.memberName}
              DOB={item.DOB}
            />
          ))}
        </Column>
      </Column>
    </Card>
  );
};
