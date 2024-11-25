import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import emptyStateDocument from '@/public/assets/empty_state_document.svg';

import Image from 'next/image';
interface addProviderInfoItemProps extends IComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addProviderInfo: any;
  icon?: JSX.Element;
}

export const AddProviderInfoItem = ({
  addProviderInfo,
}: addProviderInfoItemProps) => {
  return (
    <Card className="card-main large-section">
      <Column>
        <Header
          text={addProviderInfo.providerMemberName}
          className="title-3 text-bold"
        />
        <Spacer size={8} />
        <TextBox text={'DOB: ' + addProviderInfo.providerDOB} />
        <Spacer size={8} />
        <Divider />
        <Spacer size={32} />
        <Card className="neutral container mb-4">
          <Column className="flex flex-row align-top m-4">
            <Row>
              <Image
                src={emptyStateDocument}
                className="icon !w-10 !h-10"
                alt="emptyStateDocument"
              />
              <Spacer axis="horizontal" size={8} />
              <TextBox
                type="body-1"
                className=""
                text="We don't have a Primary Care Provider listed for you or someone on your plan. If you already have a doctor or need to find one, we'll help you get set up."
              ></TextBox>
            </Row>
            <Spacer size={8} />
            <AppLink
              className="font-bold primary-color !flex ml-10"
              url="/updateMyPrimaryCareProvider"
              label="Add a Provider"
            />
          </Column>
        </Card>
      </Column>
    </Card>
  );
};
