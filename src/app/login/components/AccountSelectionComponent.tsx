import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Checkbox } from '@/components/foundation/Checkbox';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ToolTip } from '@/components/foundation/Tooltip';
import Image from 'next/image';
import { useState } from 'react';
import infoIcon from '../../../../public/assets/info.svg';
import { useLoginStore } from '../stores/loginStore';

interface AccountSelectionComponentProps extends IComponent {
  userName: string;
}

export const AccountSelectionComponent = ({
  userName,
}: AccountSelectionComponentProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [backToHome] = useLoginStore((state) => [state.resetToHome]);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <article id="mainSection">
      <Spacer size={32} />
      <TextBox
        className="title-2"
        text="You'll be able to access all of your plans in one place."
        ariaLabel="You'll be able to access all of your plans in one place."
      />
      <Spacer size={16} />
      <Row className="flex flex-row">
        <TextBox
          type="body-1"
          text="First, let's confirm the username and password you will use from now on."
          ariaLabel="First, let's confirm the username and password you will use from now on."
          className="w-72"
        />
        <ToolTip
          showTooltip={true}
          className="flex flex-row justify-center items-end tooltip tooltipIcon relative"
          label="You have more than one account login. To make switching between your plans easier, we are going to prioritize one login over others. The username you confirm on this page will become your only username and password for all your BlueCross BlueShield of Tennessee registered accounts moving forward. Your login can be used for both the BlueCross website and mobile apps."
        >
          <Image className="size-[20px] mb-1" src={infoIcon} alt="info" />
        </ToolTip>
      </Row>

      <Spacer size={16} />
      <Card className="cursor-pointer  mb-4" type="elevated">
        <Column className="m-4">
          {' '}
          <TextBox className="body-1" text="Username:" ariaLabel="Username" />
          <TextBox
            className="body-1 font-bold"
            text={userName}
            ariaLabel={userName}
          />
        </Column>
      </Card>
      <Spacer size={16} />
      <Checkbox
        label=""
        body={
          <Column>
            <RichText
              type="body-1"
              spans={[
                <span key={0} className="font-bold">
                  I understand{' '}
                </span>,
                <span key={1}>
                  the username listed above and its password will be the only
                  login credentials for{' '}
                </span>,
                <span key={2} className="font-bold">
                  all my BlueCross BlueShield of Tennessee registered accounts{' '}
                </span>,
                <span key={3}>moving forward. </span>,
              ]}
            />
          </Column>
        }
        callback={handleCheckboxChange}
      />
      <Spacer size={16} />
      <ToolTip
        showTooltip={!isChecked}
        className="flex flex-row justify-center items-center tooltip"
        label="Check the box above to continue."
      >
        <Button
          className="font-bold body-1"
          label="Continue With This Username"
          callback={isChecked ? () => {} : undefined}
        />
      </ToolTip>

      <Spacer size={32} />
      <Divider />
      <Spacer size={32} />
      <TextBox
        className="title-3"
        text="Want to use a different username?"
        ariaLabel="Want to use a different username?"
      />
      <Spacer size={16} />
      <RichText
        type="body-1"
        spans={[
          <span key={0}>Go </span>,
          <span className="font-bold link" key={1} onClick={backToHome}>
            <a> back to the login page </a>
          </span>,
          <span key={2}>
            and sign in with the username and password you want to use.{' '}
          </span>,
        ]}
      />
      <Spacer size={32} />
      <TextBox className="title-3" text="Need help?" ariaLabel="Need help?" />
      <Spacer size={16} />
      <RichText
        type="body-1"
        spans={[
          <span key={0}>
            Give us a call using the number listed on the back of your Member ID
            card or{' '}
          </span>,
          <span className="font-bold link" key={1}>
            <a href={process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL ?? ''}>
              contact us
            </a>
          </span>,
        ]}
      />
    </article>
  );
};
