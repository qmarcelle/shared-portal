import { InputModalSlide } from '@/components/composite/InputModalSlide';
import { SuccessSlide } from '@/components/composite/SuccessSlide';
import {
  ModalChildProps,
  useAppModalStore,
} from '@/components/foundation/AppModal';
import { Column } from '@/components/foundation/Column';
import { downIcon, upIcon } from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { TextField } from '@/components/foundation/TextField';
import Image from 'next/image';
import { useState } from 'react';

interface OrderIdCardProps {
  dependentCount: number;
}

export const OrderIdCard = ({
  changePage,
  pageIndex,
  dependentCount,
}: ModalChildProps & OrderIdCardProps) => {
  const { dismissModal } = useAppModalStore();

  const [count, setCount] = useState(1);

  const handleIncrement = () => {
    if (count < dependentCount) setCount((prevCount) => prevCount + 1);
  };

  const handleDecrement = () => {
    if (count > 1) setCount((prevCount) => prevCount - 1);
  };

  const pages = [
    <InputModalSlide
      key={0}
      label="Order New ID Card"
      subLabel="Select the number of ID cards you want to order. They will be mailed to your address in 7-14 business days."
      buttonLabel="Next"
      actionArea={
        <Column>
          <TextBox className="body-1 text-center" text="Number of ID cards:" />
          <Spacer size={12} />
          <TextField
            className="numberOfCards"
            label=""
            type="number"
            value={count}
            minValue={1}
            maxValue={dependentCount}
          />
          <span onClick={handleIncrement}>
            <Image alt="Up Icon" src={upIcon} className="upIdCardIcon" />
          </span>
          <span onClick={handleDecrement}>
            <Image alt="Down Icon" src={downIcon} className="downIdCardIcon" />
          </span>
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
          <TextBox className="body-1 text-center font-bold" text="Chris Hall" />
          <TextBox
            className="body-1 text-center font-bold"
            text="123 Street Address"
          />
          <TextBox
            className="body-1 text-center font-bold"
            text="Chattanooga, Tn 37402"
          />
          <Spacer size={21} />
        </Column>
      }
      cancelCallback={() => dismissModal()}
      nextCallback={() => changePage?.(2, true)}
    />,
    <SuccessSlide
      key={2}
      label="Order Complete"
      body={
        <Column className="items-center ">
          <TextBox
            className="text-center"
            text="Your new cards will be mailed to your address in 7-14 business days"
          />
        </Column>
      }
      doneCallBack={() => dismissModal()}
    />,
  ];

  return pages[pageIndex!];
};
