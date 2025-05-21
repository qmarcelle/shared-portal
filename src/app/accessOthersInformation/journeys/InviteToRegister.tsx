import { invokeSendEmailInvite } from '@/app/personalRepresentativeAccess/actions/sendInvitePR';
import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import { ShareMyPlanDetails } from '@/models/app/getSharePlanDetails';
import alertErrorSvg from '@/public/assets/alert_error_red.svg';
import { isValidEmailAddress, validateLength } from '@/utils/inputValidator';
import { logger } from '@/utils/logger';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface InviteToRegisterProps {
  memberDetails: ShareMyPlanDetails;
  onRequestSuccessCallBack: () => void;
}

export const InviteToRegister = ({
  changePage,
  pageIndex,
  memberDetails,
  onRequestSuccessCallBack,
}: ModalChildProps & InviteToRegisterProps) => {
  const { dismissModal } = useAppModalStore();
  const [confirmEmail, setConfirmEmail] = useState('');
  const [newAuthDevice, setNewAuthDevice] = useState('');
  const [error, setError] = useState('');
  const [nextDisabled, setNextDisabled] = useState(false);
  const initiateInvite = async () => {
    try {
      const response = await invokeSendEmailInvite(
        memberDetails.memberCk,
        memberDetails.requesteeFHRID,
        confirmEmail,
      );
      logger.info('AccessOtherInfo Invite to Register- send Invite', response);
      if (response.isEmailSent === 'true') {
        changePage!(1, false);
        onRequestSuccessCallBack();
      } else {
        changePage!(2, false);
      }
    } catch (error) {
      changePage!(2, false);
      logger.error('Error from  Invite to Register{}', error);
    }
  };

  useEffect(() => {
    if (pageIndex === 0) {
      setNewAuthDevice(memberDetails.memberName);
      setConfirmEmail('');
      setError('');
      setNextDisabled(false);
    }
  }, [pageIndex, memberDetails.memberName]);

  const validateEmailAddress = (value: string) => {
    setNewAuthDevice(value);
    setNextDisabled(false);
    const isValidEmail = isValidEmailAddress(value);
    const isValidLength = validateLength(value);
    if (!isValidEmail || !isValidLength) {
      setError('Please enter a valid address.');
    } else if (confirmEmail && value !== confirmEmail) {
      setError('The email addresses must match. Please check and try again.');
    } else {
      setError('');
    }
  };

  const handleConfirmEmailChange = (val: string) => {
    setConfirmEmail(val);
    if (val && val !== newAuthDevice) {
      setError('The email addresses must match. Please check and try again.');
    } else {
      setError('');
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
          <TextBox
            className="body-1 text-center font-bold"
            text={memberDetails.memberName}
          />
          <Spacer size={32} />
          <TextBox
            className="text-center"
            text="We'll send an email inviting them to register an account. We just need their email."
          />
          <Spacer size={32} />
          <TextField
            type="text"
            valueCallback={(val) => validateEmailAddress(val)}
            label="Their Email Address"
          ></TextField>
          <Spacer size={32} />
          <TextField
            value={confirmEmail}
            valueCallback={handleConfirmEmailChange}
            type="text"
            label="Confirm Their Email Address"
          ></TextField>
          {error && (
            <div className="text-red-500 mt-2">
              <Row>
                <Image src={alertErrorSvg} className="icon mt-1" alt="" />
                <TextBox className="body-1 pt-1.5 ml-2" text={error} />
              </Row>
            </div>
          )}

          <Spacer size={32} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={nextDisabled ? undefined : initiateInvite}
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
    <ErrorDisplaySlide
      key={4}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="We weren’t able to complete this request at this time. Please try again later."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
