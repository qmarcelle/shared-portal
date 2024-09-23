import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { downIcon } from '@/components/foundation/Icons';
import { RichDropDown } from '@/components/foundation/RichDropDown';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useState } from 'react';
import { OrderIdCard } from '../journeys/OrderIdCard';
import { ImageSlider } from './ImageSlider';

export const MemberIDCardInfo = () => {
  const { showAppModal } = useAppModalStore();
  const [selectedText, setselectedText] = useState('Current Plan');
  const dropDownList = [{ id: 'Current Plan' }, { id: 'Future Plan' }];
  const handleDropDownUpdate = (value: string) => {
    setselectedText(value);
  };
  return (
    <Card className="large-section sliderdots-active sliderdots ">
      <section id="Filter">
        <Column>
          <Header className="title-2" text="Member ID Card" />
          <Spacer size={16} />
          <Row>
            <TextBox text="View ID Card for:" />
            <Spacer size={16} axis="horizontal" />
            <RichDropDown
              onSelectItem={(val) => {
                handleDropDownUpdate(val.id);
              }}
              minWidth="min-w-[232px]"
              itemData={dropDownList}
              dropdownHeader={null}
              headBuilder={() => (
                <Row>
                  <TextBox className="link" type="body-1" text={selectedText} />
                  <Image
                    src={downIcon}
                    className="w-[20px] h-[20px] ml-2 items-end"
                    alt=""
                  />
                </Row>
              )}
              selected={{ id: selectedText }}
              itemsBuilder={(data) => (
                <TextBox
                  className="border-none flex-grow"
                  type="body-1"
                  text={data.id}
                />
              )}
            />
          </Row>
          <ImageSlider />
          <Spacer size={16} />
          <section className="md:flex md:flex-row">
            <TextBox
              className="title-3 pb-[5px] md:pr-[5px] md:pb-0"
              text="All members of your plan use the same ID card."
            />
            <Column className="md:w-[405px] body-1">
              <Button label="Download ID Card" callback={() => {}} />
              <Spacer size={16} />
              <Button
                label="Order New ID Card"
                type="secondary"
                callback={() =>
                  showAppModal({
                    content: <OrderIdCard dependentCount={3} />,
                  })
                }
              />
            </Column>
          </section>
        </Column>
      </section>
    </Card>
  );
};
