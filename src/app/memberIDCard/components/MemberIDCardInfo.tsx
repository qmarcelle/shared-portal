import { useAppModalStore } from '@/components/foundation/AppModal';
import { Button } from '@/components/foundation/Button';
import { CalendarField } from '@/components/foundation/CalendarField';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Radio } from '@/components/foundation/Radio';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { base64ToBlob } from '@/utils/base64_blob_converter';
import download from 'downloadjs';
import Image from 'next/image';
import { useState } from 'react';
import AlertIcon from '../../../../public/assets/alert_gray.svg';
import { getIDCardPdf } from '../actions/getIdCardPdf';
import { OrderIdCard } from '../journeys/OrderIdCard';
import { IdCardMemberDetails } from '../model/app/idCardData';
import { ImageSlider } from './ImageSlider';

export type MemberIDCardInfoProps = {
  svgFrontData: string | null;
  svgBackData: string | null;
  memberDetails: IdCardMemberDetails | null;
} & IComponent;

type CardType = 'current' | 'future';

export const MemberIDCardInfo = ({
  svgFrontData,
  svgBackData,
  memberDetails,
}: MemberIDCardInfoProps) => {
  const { showAppModal } = useAppModalStore();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedCardType, setSelectedCardType] = useState<CardType>('current');
  const [downloadIdCardErrorMsg, setDownloadIdCardErrorMsg] = useState(false);

  const handleDateSelection = (value: string) => {
    setSelectedDate(value);
  };

  const handleCardSelection = (value: CardType) => {
    setSelectedCardType(value);
  };

  const downloadIdCard = async () => {
    const resp = await getIDCardPdf(
      selectedCardType == 'future' && selectedDate != null
        ? selectedDate
        : undefined,
    );
    if (resp.status == 200) {
      setDownloadIdCardErrorMsg(false);
      const pdfBlob = base64ToBlob(resp.data!, 'application/pdf');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      // Open the ID Card PDF in a new tab.
      window.open(pdfUrl);
      // Download the ID Card pdf
      download(pdfBlob, 'IDCard', 'application/pdf');
    } else {
      setDownloadIdCardErrorMsg(true);
    }
  };
  return (
    <Card className="large-section sliderdots-active sliderdots">
      <section id="Filter">
        <Column>
          <Header className="title-2" text="Member ID Card" />
          <Spacer size={16} />
          <TextBox text="All members of your plan use the same ID card." />
          <ImageSlider svgFrontData={svgFrontData} svgBackData={svgBackData} />
          <Spacer size={16} />
          <section>
            <TextBox className="title-3" text="Download ID Cards" />
            {!downloadIdCardErrorMsg && (
              <Column>
                <TextBox
                  type="body-1"
                  className="mt-4 mb-2"
                  text="Select the card you want to download:"
                />
                <Column className="body-1">
                  <ul className="flex flex-col gap-2">
                    <Radio
                      key="current"
                      label="Get a card for the plan I have today."
                      selected={selectedCardType == 'current'}
                      callback={() => handleCardSelection('current')}
                    />
                    <Radio
                      key="later"
                      label="Get a card for a plan starting at a later date."
                      childBuilder={(selected) => {
                        if (selected) {
                          return (
                            <CalendarField
                              disabled={selectedCardType == 'current'}
                              label="When does this plan begin?"
                              valueCallback={(val) => handleDateSelection(val)}
                              isSuffixNeeded={true}
                              minDate={new Date()}
                              minDateErrMsg="The date entered is out of range."
                            />
                          );
                        }
                      }}
                      selected={selectedCardType == 'future'}
                      callback={() => handleCardSelection('future')}
                    />
                  </ul>

                  <Button
                    className="w-[256px] mt-5"
                    label="Download ID Card"
                    callback={
                      selectedCardType === 'current' ||
                      (selectedCardType === 'future' && selectedDate)
                        ? downloadIdCard
                        : undefined
                    }
                  />
                </Column>
              </Column>
            )}
            {downloadIdCardErrorMsg && (
              <Column className="downloadErrorMsg">
                <Row>
                  <Image src={AlertIcon} className="icon" alt="alert" />
                  <TextBox
                    className="body-1 pt-1 ml-2"
                    text="Your digital ID card is unavailable right now. We’re working on it and hope to have it up soon."
                  />
                </Row>
              </Column>
            )}
          </section>
          <Divider className="mt-8" />
          <section>
            <Spacer size={32} />
            <TextBox className="title-3" text="Order New ID Cards" />
            <Spacer size={16} />
            <TextBox text="Order a printed Member ID card(s) for your current plan." />
            <Spacer size={32} />
            <Button
              label="Order New ID Cards"
              type="secondary"
              className="w-[50%]"
              callback={() =>
                showAppModal({
                  content: <OrderIdCard memberDetails={memberDetails} />,
                })
              }
            />
          </section>
        </Column>
      </section>
    </Card>
  );
};
