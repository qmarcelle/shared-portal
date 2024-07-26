'use client';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { ThirdPartySharingInfo } from './components/ThirdPartySharingInfo';

const ThirdPartySharing = () => {
  return (
    <section className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Header className="pl-3" type="title-1" text="Third Party Sharing" />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ThirdPartySharingInfo />
          </Column>
          <Column className="flex-grow page-section-36_67 items-stretch">
            <Card className="small-section">
              <Column>
                <Header
                  className="title-2"
                  text="Help with Third Party Sharing"
                />
                <Spacer size={16} />
                <TextBox
                  className="body-1"
                  text="If you see an app or website that you didn't add, please remove it then reach out to us. You can call us at 1-800-0000 or begin a chat."
                />
              </Column>
            </Card>
          </Column>
        </section>
      </Column>
    </section>
  );
};

export default ThirdPartySharing;
