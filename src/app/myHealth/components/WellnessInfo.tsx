import { Button } from '@/components/foundation/Button';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Header } from '../../../components/foundation/Header';
import { externalIcon } from '../../../components/foundation/Icons';

interface WellnessInfoProps extends IComponent {
  header: string;
  subHeader: string;
  bodyText: string;
  buttonText: string;
}

export const WellnessInfo = ({
  className,
  header,
  subHeader,
  bodyText,
  buttonText,
}: WellnessInfoProps) => {
  const router = useRouter();
  return (
    <>
      <Spacer size={32} />
      <Header text={header} />
      <Card className={className}>
        <Column>
          <Header type="title-2" text={subHeader} />
          <Spacer size={25} />
          <TextBox text={bodyText} />
          <Spacer size={18} />
          <Button
            type="secondary"
            className="w-1/5"
            label={buttonText}
            icon={<Image alt="" src={externalIcon} />}
            callback={() => {
              router.push(
                '/sso/launch?PartnerSpId=' +
                  process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS,
              );
            }}
          />
        </Column>
      </Card>
    </>
  );
};
