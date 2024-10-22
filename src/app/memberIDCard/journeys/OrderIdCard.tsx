import { ErrorDisplaySlide } from '@/components/composite/ErrorDisplaySlide';
import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { StepUpDown } from '@/components/foundation/StepUpDown';
import { TextBox } from '@/components/foundation/TextBox';
import { toPascalCase } from '@/utils/pascale_case_formatter';
import { formatZip } from '@/utils/zipcode_formatter';
import { useState } from 'react';
import { orderIdCard } from '../actions/orderIdCard';
import { IdCardMemberDetails } from '../model/app/idCardData';

interface OrderIdCardProps {
  memberDetails: IdCardMemberDetails | null;
}

export const OrderIdCard = ({
  changePage,
  pageIndex,
  memberDetails,
}: ModalChildProps & OrderIdCardProps) => {
  const { dismissModal } = useAppModalStore();

  const [count, setCount] = useState(1);
  const dependentCount =
    memberDetails?.memberRelation == 'M' ? memberDetails?.noOfDependents : 1;
  const memberName = toPascalCase(
    `${memberDetails?.first_name} ${memberDetails?.last_name}`,
  );
  const addressLine1 = toPascalCase(memberDetails?.contact?.address1 ?? '');
  const addressLine2 = toPascalCase(
    `${memberDetails?.contact?.city} ${memberDetails?.contact?.state} ${formatZip(memberDetails?.contact?.zip)}`,
  );

  const invokeOrderIdCard = async () => {
    try {
      const response = await orderIdCard(count);
      if (response.retcode != 0) {
        throw new Error('Return code is not 0');
      }
      changePage?.(2, true);
    } catch (error) {
      changePage?.(3, true);
    }
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Order New ID Card"
      subLabel="Select the number of ID cards you want to order. They will be mailed to your address in 7–14 business days."
      buttonLabel="Next"
      actionArea={
        <Column>
          <TextBox className="body-1 text-center" text="Number of ID Cards:" />
          <Spacer size={12} />
          <StepUpDown
            className="numberOfCards"
            value={1}
            minValue={1}
            maxValue={dependentCount}
            valueCallback={(val) => setCount(val)}
          />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={() => changePage?.(1, true)}
    />,
    <InputModalSlide
      key={1}
      label="Confirm Your Contact Information"
      subLabel={`${count} new cards will be mailed to this address:`}
      buttonLabel="Complete Order"
      actionArea={
        <Column>
          <TextBox className="body-1 text-center font-bold" text={memberName} />
          <TextBox
            className="body-1 text-center font-bold"
            text={addressLine1 ?? ''}
          />
          <TextBox
            className="body-1 text-center font-bold"
            text={addressLine2}
          />
          <Spacer size={21} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={() => invokeOrderIdCard()}
    />,
    <SuccessSlide
      key={2}
      label="Order Complete"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Your new cards will be mailed to your address in 7–14 business days."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
    <ErrorDisplaySlide
      key={3}
      label="Try Again Later"
      body={
        <Column className="items-center">
          <TextBox
            className="text-center"
            text="Oops! We're sorry. Something went wrong. Please try again."
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
