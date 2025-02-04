import { InitModalSlide } from '@/components/composite/InitModalSlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Radio } from '@/components/foundation/Radio';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';
import FullAndBasicAccessOption from '../components/FullAndBasicAccessOption';

const bottomNote = `Disclaimer: BlueCross BlueShield of Tennessee is not responsible for your personal representative or any third parties authorized by you or your personal representative to have access to your health information. 
  BlueCross BlueShield of Tennessee does not warrant that information provided with be accurate, timely, or complete.`;

interface InviteToRegisterProps {
  memberName: string;
}

export const EditLevelOfAccess = ({
  changePage,
  pageIndex,
  memberName,
}: ModalChildProps & InviteToRegisterProps) => {
  const [selectedData, setSelectedData] = useState(false);

  function handleClick() {
    setSelectedData(true);
    setSelectedData(!selectedData);
  }

  const { dismissModal } = useAppModalStore();

  const pages = [
    <InitModalSlide
      key="first"
      label="Edit Level Of Access"
      subLabel={
        <Column>
          <TextBox className="text-center" text="You're changing access for:" />
          <Spacer size={24} />
          <TextBox className="text-center bold" text="Chris Hall" />
          <Spacer size={24} />
          <Column>
            <Radio
              label="Full Access"
              subLabel="Your Representative will have access to all documents and claims, even those with sensitive information"
              selected={!selectedData}
              callback={handleClick}
            />
            <Radio
              label="Basic Access"
              subLabel="Your Representative will have access to all documents and claims, but will not be able to view sensitive information"
              selected={selectedData}
              callback={handleClick}
            />
          </Column>
        </Column>
      }
      changeAuthButton={undefined}
      buttonLabel="Next"
      nextCallback={() => changePage?.(1, true)}
      bottomNote={<TextBox className="body-2" text={bottomNote} />}
      cancelCallback={() => dismissModal()}
    />,
    <InputModalSlide
      key="second"
      label="Edit Level Of Access"
      subLabel=""
      actionArea={<FullAndBasicAccessOption selectedData={selectedData} />}
      buttonLabel="Save Permissions"
      nextCallback={() => changePage?.(2, true)}
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
