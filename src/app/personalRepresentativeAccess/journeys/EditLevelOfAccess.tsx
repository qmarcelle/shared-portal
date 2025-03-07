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
import FullAndBasicAccessOption from '../components/FullAndBasicAccessOption';

const bottomNote =
  'Disclaimer: BlueCross BlueShield of Tennessee is not responsible for your personal representative or any third parties authorized by you or your personal representative to hae access to your health information. BlueCross BlueShield of Tennessee does not warrant that the information provided will be accurate, timely or complete.';

export type AccessType = 'basic' | 'full' | 'none';
interface InviteToRegisterProps {
  memberName: string;
  requestorType?: string;
  targetType?: string;
  currentAccessType: AccessType;
  isMaturedMinor?: boolean;
}

export const EditLevelOfAccess = ({
  changePage,
  pageIndex,
  memberName,
  targetType = '',
  currentAccessType,
  isMaturedMinor,
}: ModalChildProps & InviteToRegisterProps) => {
  const [selectedData, setSelectedData] =
    useState<AccessType>(currentAccessType);

  const handleClick = (val: AccessType) => {
    setSelectedData(val);
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
              label={`Full ${isMaturedMinor ? 'Access' : 'Sharing'}`}
              subLabel={
                isMaturedMinor
                  ? 'Your Representative will have access to all documents and claims, even those with sensitive information'
                  : 'They’ll see documents and claims, even those with sensitive information.'
              }
              selected={selectedData === 'full'}
              callback={() => handleClick('full')}
            />
            <Spacer size={16} />
            <Radio
              label={`Basic ${isMaturedMinor ? 'Access' : 'Sharing'}`}
              subLabel={
                isMaturedMinor
                  ? 'Your Representative will have access to all documents and claims, but will not be able to view sensitive information'
                  : 'They won’t be able to see documents or claims with sensitive information.'
              }
              selected={selectedData === 'basic'}
              callback={() => handleClick('basic')}
            />
            <Spacer size={16} />
            {!isMaturedMinor && (
              <>
                {targetType !== 'subscriber' ? (
                  <Radio
                    label="None"
                    subLabel="They won’t see any documents and claims."
                    selected={selectedData === 'none'}
                    callback={() => handleClick('none')}
                  />
                ) : (
                  <RichText
                    spans={[
                      <span key={1}>
                        <Link href="/contact" className="link font-bold">
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
      nextCallback={() => changePage?.(selectedData !== 'none' ? 1 : 2)}
      bottomNote={<TextBox className="body-2" text={bottomNote} />}
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key="second"
      label="Edit Level Of Access"
      subLabel=""
      actionArea={
        <FullAndBasicAccessOption
          isMaturedMinor={isMaturedMinor}
          accessType={selectedData}
        />
      }
      buttonLabel="Save Permissions"
      nextCallback={() => changePage?.(2)}
      cancelCallback={() => dismissModal()}
    />,
    <SuccessSlide
      key="third"
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
  ];

  return pages[pageIndex!];
};
