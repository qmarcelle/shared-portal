import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface RequestAccessOnMyPlanProps {
  memberName: string;
}

export const RequestAccessOnMyPlan = ({
  changePage,
  pageIndex,
  memberName,
}: ModalChildProps & RequestAccessOnMyPlanProps) => {
  const { dismissModal } = useAppModalStore();
  const initChange = () => {
    changePage!(1, false);
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Request Access"
      subLabel="You're requesting access to:"
      buttonLabel="Send Request"
      actionArea={
        <Column>
          <TextBox className="body-1 text-center font-bold" text={memberName} />
          <Spacer size={32} />
          <TextBox
            className="text-center"
            text="We'll send an email requesting your access to their account to the email address we have on file for this member."
          />
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={initChange}
    />,
    <SuccessSlide
      key={1}
      label="Access Request Sent"
      body={
        <Column className="items-center ">
          <TextBox
            className="text-center"
            text="We've sent an email requesting your access. They will approve or deny this request and be able to set the level of access you have to their account."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
