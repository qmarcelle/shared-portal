import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InitModalSlide } from '@/components/composite/InitModalSlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Link from 'next/link';
import { useState } from 'react';
import { updateConsentDataAction } from '../actions/getPersonalRepresentativeData';
import FullAndBasicAccessOption from '../components/FullAndBasicAccessOption';
import { UpdateConsentRequest } from '../models/updateConsentRequest';

const bottomNote =
  'Disclaimer: BlueCross BlueShield of Tennessee is not responsible for your personal representative or any third parties authorized by you or your personal representative to hae access to your health information. BlueCross BlueShield of Tennessee does not warrant that the information provided will be accurate, timely or complete.';

export type AccessType = 'basic' | 'full' | 'none';
interface InviteToRegisterProps {
  memberName: string;
  requestorType?: string;
  targetType?: string;
  currentAccessType: string;
  isMaturedMinor?: boolean;
  disableSubmit?: boolean;
  id?: string;
  policyId?: string;
  expiresOn?: string;
  effectiveOn?: string;
  firstName?: string;
  lastName?: string;
}

export const EditLevelOfAccess = ({
  changePage,
  pageIndex,
  memberName,
  targetType = '',
  currentAccessType,
  isMaturedMinor,
  disableSubmit = false,
  id,
  policyId,
  expiresOn,
  effectiveOn,
  firstName,
  lastName,
}: ModalChildProps & InviteToRegisterProps) => {
  const [selectedData, setSelectedData] = useState<string>(currentAccessType);

  const handleClick = (val: string) => {
    setSelectedData(val);
  };
  const handleNext = async () => {
    try {
      const request: UpdateConsentRequest = {
        consentId: id,
        policyId: policyId,
        effectiveOn: effectiveOn,
        expiresOn: expiresOn,
        requestType: 'update',
        firstName: firstName,
        lastName: lastName,
      };

      const response = await updateConsentDataAction({
        request,
      });

      if (response?.data?.message === 'Success') {
        changePage?.(2);
      } else {
        changePage?.(3);
      }
    } catch (error) {
      changePage?.(3);
      console.error('Error in Editing Level of Access:', error);
    }
  };

  const { dismissModal } = useAppModalStore();

  const pages = [
    <InitModalSlide
      key="first"
      label="Edit Level Of Access"
      subLabel={
        <Column>
          <TextBox className="text-center" text="You’re changing access for:" />
          <Spacer size={16} />
          <TextBox className="text-center font-bold" text={memberName} />
          <Spacer size={32} />
          <Column>
            <Radio
              label={`Full ${isMaturedMinor ? 'Access +' : 'Sharing'}`}
              subLabel={
                isMaturedMinor
                  ? 'Your personal representative and anyone they choose will have access to all documents and claims, even those with sensitive information.'
                  : 'They’ll see documents and claims, even those with sensitive information.'
              }
              selected={selectedData === 'Full Access'}
              callback={() => handleClick('Full Access')}
            />
            <Spacer size={16} />
            <Radio
              label={`Basic ${isMaturedMinor ? 'Access' : 'Sharing'}`}
              subLabel={
                isMaturedMinor
                  ? 'Your personal representative will have access to all documents and claims, but will not be able to view sensitive information.'
                  : 'They won’t be able to see documents or claims with sensitive information.'
              }
              selected={selectedData === 'Basic Access'}
              callback={() => handleClick('Basic Access')}
            />
            <Spacer size={16} />
            {!isMaturedMinor && (
              <>
                {targetType !== 'subscriber' ? (
                  <Radio
                    label="None"
                    subLabel="They won’t see any documents and claims."
                    selected={selectedData === 'None'}
                    callback={() => handleClick('None')}
                  />
                ) : (
                  <RichText
                    spans={[
                      <span key={1}>
                        <Link href="/member/support" className="link font-bold">
                          Contact us
                        </Link>
                      </span>,
                      <span key={2}>
                        {' to remove the subscriber’s access.'}
                      </span>,
                    ]}
                  />
                )}
              </>
            )}
          </Column>
        </Column>
      }
      changeAuthButton={undefined}
      buttonLabel="Next"
      nextCallback={() => {
        // If we're disabling submit prevent the call from happening when none is selected.
        // If Full/Basic is selected submit is disable on final slide of modal.
        if (selectedData == 'none') {
          if (!disableSubmit) changePage?.(2);
        } else changePage?.(1);
      }}
      bottomNote={<TextBox className="body-2" text={bottomNote} />}
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key={2}
      label="Edit Level Of Access"
      subLabel=""
      actionArea={
        <FullAndBasicAccessOption
          isMaturedMinor={isMaturedMinor}
          accessType={selectedData}
          memberName={memberName}
        />
      }
      buttonLabel="Save Permissions"
      nextCallback={() => handleNext()}
      cancelCallback={() => dismissModal()}
      disableSubmit={disableSubmit}
    />,
    <SuccessSlide
      key={3}
      label="Level Of Access Saved"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="The Level of access to your account information has been updated for:"
          />
          <Spacer size={16} />
          <TextBox className="font-bold" text={memberName} />
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
            text="We weren’t able to update your settings at this time. Please try again later."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
