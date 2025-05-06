import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import {
  amplifyHealthAppPromoImg,
  appleStoreLogo,
  playStoreLogo,
} from '@/components/foundation/Icons';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import Link from 'next/link';

export const AmplifyHealthCard = () => {
  return (
    <Card className="!bg-secondary-focus !p-0 large-section relative">
      <Column className="sm:flex-row">
        <Column className="p-4 sm:py-8 sm:pl-8 basis-1/2 flex-shrink-0 box-border">
          <TextBox type="title-2" text="Bring Your Advisor With You" />
          <TextBox
            className="mt-4 mb-8"
            type="body-1"
            text="Use the AmplifyHealth App to connect with your health advisor and access all the benefits your plan has to offer."
          />
          <Column className="sm:flex-row">
            <Link href="https://apps.apple.com/us/app/amplifyhealth/id6444489335">
              <Image
                src={appleStoreLogo}
                alt="Download Amplify App from AppStore"
              />
            </Link>
            <Link
              className="mt-4 sm:ml-4 sm:mt-0"
              href="https://play.google.com/store/apps/details?id=com.bcbst.amplify&hl=en_US"
            >
              <Image
                src={playStoreLogo}
                alt="Download Amplify App from PlayStore"
              />
            </Link>
          </Column>
        </Column>
        <Image
          className="min-h-[280px] self-end object-cover sm:self-auto basis-1/2 min-w-0"
          src={amplifyHealthAppPromoImg}
          alt="Amplify Health App"
        />
      </Column>
    </Card>
  );
};
