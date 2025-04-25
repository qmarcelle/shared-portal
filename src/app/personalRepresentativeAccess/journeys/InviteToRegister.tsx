import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { logger } from '@/utils/logger';
import { useState } from 'react';
import { invokeSendEmailInvite } from '../actions/sendInvitePR';

interface InviteToRegisterProps {
  memberName: string;
  memeCk: string;
  requesteeFHRID: string;
  isMaturedMinor?: boolean;
  onRequestSuccessCallBack: () => void;
}

export const InviteToRegister = ({
  changePage,
  pageIndex,
  memberName,
  isMaturedMinor,
  memeCk,
  requesteeFHRID,
  onRequestSuccessCallBack,
}: ModalChildProps & InviteToRegisterProps) => {
  const { dismissModal } = useAppModalStore();
  const [inputValue, setInputValue] = useState('');

  const initiateInvite = async () => {
    try {
      const response = await invokeSendEmailInvite(
        memeCk,
        requesteeFHRID,
        inputValue,
      );
      if (response.isEmailSent === 'true') {
        changePage!(1, false);
        onRequestSuccessCallBack();
      }
    } catch (error) {
      logger.error('Error from Send Invite Request', error);
    }
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Invite to Register"
      subLabel="You're inviting:"
      buttonLabel="Send Invite"
      actionArea={
        <Column>
          {isMaturedMinor ? (
            <TextBox className="font-bold body-1" text={memberName} />
          ) : (
            <TextBox className="font-bold body-1" text="[Mature Minor]" />
          )}
          <Spacer size={32} />
          <TextBox
            className="text-center"
            text="We'll send an email inviting them to register an account. We just need their email."
          />
          <Spacer size={32} />
          <TextField type="text" label="Their Email Address"></TextField>
          <Spacer size={32} />
          <TextField
            type="text"
            label="Confirm Their Email Address"
            className="emailInvite"
            valueCallback={(e) => setInputValue(e)}
          ></TextField>
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={initiateInvite}
    />,
    <SuccessSlide
      key={1}
      label="Invitation to Register Sent"
      body={
        <Column className="items-center ">
          <TextBox
            className="text-center"
            text="We've sent an email inviting this member to register. Once they've completed registration, you'll be able to request access to their information"
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
