import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import {
  AccessStatus,
  ShareMyPlanDetails,
} from '@/models/app/getSharePlanDetails';
import { capitalizeName } from '@/utils/capitalizeName';
import { logger } from '@/utils/logger';
import { requestAccessToMembers } from '../action/getAccessOtherInformationData';

interface RequestAccessOnMyPlanProps {
  memberDetails: ShareMyPlanDetails;
  onRequestSuccessCallBack: () => void;
  disableSubmit?: boolean;
}

export const RequestAccessOnMyPlan = ({
  changePage,
  pageIndex,
  memberDetails,
  onRequestSuccessCallBack,
  disableSubmit = false,
}: ModalChildProps & RequestAccessOnMyPlanProps) => {
  const { dismissModal } = useAppModalStore();

  const accessOthersInformationRequest = async (
    memberDetails: ShareMyPlanDetails,
  ) => {
    try {
      const response = await requestAccessToMembers(memberDetails);
      if (response.isEmailSent.toLowerCase() === 'true') {
        changePage!(1, false);
        onRequestSuccessCallBack();
      } else {
        changePage!(2, false);
      }
    } catch (error) {
      changePage!(2, false);
      logger.error('Error from  AccessOthersInformationRequest', error);
    }
  };

  function getAccessType() {
    if (memberDetails.accessStatus === AccessStatus.NoAccess) return 'Basic';
    else return 'Full';
  }

  const pages = [
    <InputModalSlide
      key={0}
      label="Request Access"
      subLabel=<RichText
        type="body-1"
        spans={[
          <span key={0}>You&apos;re requesting </span>,
          <span className="font-bold" key={1}>
            {getAccessType()}
            {' Access '}
          </span>,
          <span key={2}>to:</span>,
        ]}
      />
      buttonLabel="Send Request"
      actionArea={
        <Column>
          <TextBox
            className="body-1 text-center font-bold"
            text={capitalizeName(memberDetails.memberName)}
          />
          <Spacer size={32} />

          <RichText
            type="body-1"
            className="text-center"
            spans={[
              <span key={0}>
                We&apos;ll send an email to this member requesting{' '}
              </span>,
              <span key={1}>{getAccessType()} </span>,
              <span key={2}>view access to their account.</span>,
            ]}
          />
          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={() => accessOthersInformationRequest(memberDetails)}
      disableSubmit={disableSubmit}
    />,
    <SuccessSlide
      key={1}
      label="Access Request Sent"
      body={
        <Column className="items-center ">
          <TextBox
            className="text-center"
            text="We've sent an email requesting your access. They will be able to set the level of access you have to their account."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    <ErrorDisplaySlide
      key={2}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="We weren't able to complete this request at this time. Please try again later."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
