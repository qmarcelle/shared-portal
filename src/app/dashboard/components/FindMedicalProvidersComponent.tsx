'use client';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  externalIcon,
  externalOffsiteWhiteIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FindMedicalProvidersComponentProps extends IComponent {
  isButtonHorizontal?: boolean;
  className?: string;
}

export const FindMedicalProvidersComponent = ({
  isButtonHorizontal,
  className,
}: FindMedicalProvidersComponentProps) => {
  const router = useRouter();
  return (
    <Card className={`large-section ${className}`}>
      <section className="gap-8">
        <Row className="align-top items-center">
          <Image
            src="/assets/find_care_map.svg"
            className="w-[40px] h-[40px]"
            alt=""
          />
          <Spacer axis="horizontal" size={16} />
          <Header
            text="Find Medical Providers"
            type="title-3"
            className="!font-bold"
          />
        </Row>
        <Spacer size={16} />
        <RichText
          spans={[
            <span key={0}>
              Use the employer-provided Embold Health search tool to{' '}
            </span>,
            <span key={1} className="font-bold">
              find medical providers.{' '}
            </span>,
            <span key={2}>If you need to </span>,
            <span key={3} className="font-bold">
              find other care
            </span>,
            <span key={4}>
              , like dental or vision, use our find care search tool.
            </span>,
          ]}
        />
        <Spacer size={32} />
        <Column
          className={`flex ${isButtonHorizontal ? 'lg:!flex-row space-x-2' : 'flex-col space-y-2'}`}
        >
          <Button
            icon={<Image alt="external icon" src={externalOffsiteWhiteIcon} />}
            label="Find Medical Providers"
            callback={() => {
              router.push(
                '/sso/launch?PartnerSpId=' + process.env.NEXT_PUBLIC_IDP_EMBOLD,
              );
            }}
          />
          <Spacer size={16} />
          <Button
            className="relative group"
            type="secondary"
            icon={
              <>
                <Image
                  className="group-hover:hidden"
                  alt="external icon"
                  src={externalIcon}
                />
                <Image
                  className="hidden group-hover:block absolute top-2"
                  alt="external icon"
                  src={externalOffsiteWhiteIcon}
                />
              </>
            }
            label="Find Other Care"
            callback={() => {
              router.push(
                '/sso/launch?PartnerSpId=' +
                  process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY,
              );
            }}
          />
        </Column>
      </section>
    </Card>
  );
};
