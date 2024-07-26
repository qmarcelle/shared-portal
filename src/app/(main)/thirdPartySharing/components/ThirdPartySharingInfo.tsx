import { UpdateRowWithStatus } from '@/components/composite/UpdateRowWithStatus';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Dropdown } from '@/components/foundation/Dropdown';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import deleteIcon from '../../../../../public/assets/delete.svg';
import { ThirdPartySharingJourney } from './journeys/ThirdPartySharingJourney';

export const ThirdPartySharingInfo = () => {
  const thirdPartyAppList = [
    {
      appName: 'MyFHR App',
      connectedDate: '01/01/2023',
    },
    {
      appName: 'Erlanger Hospital',
      connectedDate: '01/01/2023',
    },
  ];
  const { showAppModal } = useAppModalStore();
  return (
    <Card className="large-section ">
      <Column>
        <Header className="title-2" text="Linked Apps & Websites" />
        <Spacer size={16} />
        <TextBox text="Below are the apps and websites you’re sharing your information with." />
        <Spacer size={32} />
        <Row>
          <TextBox className="body-1" text="Plan: " />
          <Spacer axis="horizontal" size={8} />
          <Dropdown
            onSelectCallback={() => {}}
            initialSelectedValue="0"
            items={[
              { label: 'Subscriber ID ABC123456789', value: '0' },
              { label: 'Subscriber ID ABC000000000', value: '1' },
            ]}
          />
        </Row>
        <Spacer size={32} />

        {thirdPartyAppList.length > 0 ? (
          thirdPartyAppList.map((item, index) => (
            <Column key={index}>
              <UpdateRowWithStatus
                onClick={() =>
                  showAppModal({
                    content: (
                      <ThirdPartySharingJourney appName={item.appName} />
                    ),
                  })
                }
                label={<TextBox className="font-bold" text={item.appName} />}
                subLabel={'Connected On ' + item.connectedDate}
                methodName="Remove"
                divider={index == thirdPartyAppList.length - 1 ? false : true}
                onOffLabelEnabled={false}
                icon={<Image src={deleteIcon} alt="delete icon"></Image>}
              />
              <Spacer size={32} />
            </Column>
          ))
        ) : (
          <Card className="neutral container p-4 ">
            <Column>
              <TextBox text="You haven’t shared your health information with any third-party apps or websites." />
            </Column>
          </Card>
        )}
      </Column>
    </Card>
  );
};
