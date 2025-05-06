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

interface InviteToRegisterProps {
  memberName: string;
}

export const InviteToRegister = ({
  changePage,
  pageIndex,
  memberName,
}: ModalChildProps & InviteToRegisterProps) => {
  const { dismissModal } = useAppModalStore();
  const initChange = () => {
    changePage!(1, false);
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Invite to Register"
      subLabel="You're inviting:"
      buttonLabel="Send Invite"
      actionArea={
        <Column>
          <TextBox className="body-1 text-center font-bold" text={memberName} />
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
          ></TextField>
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={initChange}
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
