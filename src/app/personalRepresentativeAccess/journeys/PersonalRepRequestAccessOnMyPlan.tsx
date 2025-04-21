import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { logger } from '@/utils/logger';
import { requestFullAccessToMembers } from '../actions/getPersonalRepresentativeAccess';

interface PersonalRepRequestAccessOnMyPlanProps {
  memberName: string;
  isMaturedMinor?: boolean;
  memeCk: string;
  requesteeFHRID: string;
  requesteeUMPID: string;
  onRequestSuccessCallBack: () => void;
}

export const PersonalRepRequestAccessOnMyPlan = ({
  changePage,
  pageIndex,
  memberName,
  memeCk,
  requesteeFHRID,
  requesteeUMPID,
  onRequestSuccessCallBack,
}: ModalChildProps & PersonalRepRequestAccessOnMyPlanProps) => {
  const { dismissModal } = useAppModalStore();

  const personalRepresentativeAccessRequest = async (
    memeCk: string,
    requesteeFHRID: string,
    requesteeUMPID: string,
  ) => {
    try {
      const response = await requestFullAccessToMembers(
        memeCk,
        requesteeFHRID,
        requesteeUMPID,
      );
      if (response.isEmailSent === 'true') {
        changePage!(1, false);
        onRequestSuccessCallBack();
      } else {
        changePage!(2, false);
      }
    } catch (error) {
      changePage!(2, false);
      logger.error('Error from  personalRepresentativeAccessRequest', error);
    }
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
      nextCallback={() =>
        personalRepresentativeAccessRequest(
          memeCk,
          requesteeFHRID,
          requesteeUMPID,
        )
      }
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
