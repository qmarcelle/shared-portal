import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { capitalizeName } from '@/utils/capitalizeName';

interface RemoveUserOutsideMyPlanProps {
  memberName: string;
}

export const RemoveUserOusideMyPlan = ({
  changePage,
  pageIndex,
  memberName,
}: ModalChildProps & RemoveUserOutsideMyPlanProps) => {
  const { dismissModal } = useAppModalStore();
  const pages = [
    <InputModalSlide
      key={0}
      label="Remove Authorized Access"
      subLabel="You're removig access for:"
      buttonLabel="Remove Access"
      actionArea={
        <Column>
          <TextBox
            text={capitalizeName(memberName)}
            className="font-bold text-center"
          ></TextBox>
          <Spacer size={24} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={() => changePage!(1, false)}
    />,
    <SuccessSlide
      key={1}
      label={'Access Removed'}
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Access to your account information has beed successfully removed for:"
          ></TextBox>
          <Spacer size={16} />
          <TextBox
            text={capitalizeName(memberName)}
            className="font-bold text-center"
          ></TextBox>
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
