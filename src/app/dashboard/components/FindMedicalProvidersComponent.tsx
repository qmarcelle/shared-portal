import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Header } from '@/components/foundation/Header';
import {
  externalIcon,
  externalOffsiteWhiteIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import FindCare from '../../../../public/assets/find_Care.svg';
export const FindMedicalProvidersComponent = ({}) => {
  return (
    <Card className="large-section !mx-3">
      <section className="gap-8">
        <Row className="align-top items-center">
          <Image src={FindCare} className="w-[40px] h-[40px]" alt="" />
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
        <Button
          icon={<Image alt="external icon" src={externalOffsiteWhiteIcon} />}
          label="Find Medical Providers"
          callback={() => null}
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
          callback={() => null}
        />
      </section>
    </Card>
  );
};
