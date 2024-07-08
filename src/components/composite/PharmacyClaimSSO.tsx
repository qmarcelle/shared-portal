import { Card } from '../foundation/Card';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { Header } from '../foundation/Header';
import { Column } from '../foundation/Column';
import externalIcon from '@/../public/External.svg';
import Image from 'next/image';
import { AppLink } from '../foundation/AppLink';

export const PharmacyClaimSSO = () => {
  return (
    <section>
      <Card className="small-section">
        <Column className="flex flex-col ">
          <Header className="title-2 px-1" text="Find More Details" />
          <Spacer size={16} />
          <TextBox
            className="px-1"
            text="CVS Caremark is your pharmacy benefit manager. You can find more information about your pharmacy claim on Caremark."
          />
          <Spacer size={32} />
          <AppLink
            label="Go to Caremark"
            icon={<Image src={externalIcon} alt="external" />}
          />
        </Column>
      </Card>
    </section>
  );
};
