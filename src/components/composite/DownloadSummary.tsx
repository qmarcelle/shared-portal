import Image from 'next/image';
import downloadIcon from '../../../public/assets/download.svg';
import { Button } from '../foundation/Button';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { RichText } from '../foundation/RichText';
import { Spacer } from '../foundation/Spacer';

export const DownloadSummary = () => {
  return (
    <main className="flex flex-col justify-end items-end page">
      <Column>
        <Card type="elevated" className="small-section w-[352px] h-[232px] ">
          <Column>
            <Header className="title-2" text="Download Summary" />
            <Spacer size={16} />
            <RichText
              spans={[
                <span key={0}>
                  You can print your claim summary from the downloaded pdf.
                </span>,
              ]}
            />
            <Spacer size={32} />
            <Button
              icon={<Image src={downloadIcon} className="ml-2" alt="" />}
              label="Claim Summary"
              type="secondary"
            />
          </Column>
        </Card>
      </Column>
    </main>
  );
};
