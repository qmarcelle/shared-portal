import { BenefitsProviderInfo } from '@/app/dashboard/models/BenefitsProviderInfo';
import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { SlidingCarousel } from '@/components/foundation/SlidingCarousel';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { BenefitsProviderInfoCard } from './BenefitsProviderInfoCard';

interface EmployeeProvidedBenefitsProps extends IComponent {
  employer: string;
  benefits: BenefitsProviderInfo[];
  employerLogo: string;
}

export const EmployeeProvidedBenefitsTile = ({
  employer,
  benefits,
  className,
  employerLogo,
}: EmployeeProvidedBenefitsProps) => {
  return (
    <Card className={className}>
      <Column>
        <Image
          className="block mb-6 mt-3 sm:hidden"
          src={employerLogo}
          alt="Provider logo"
          width={170}
          height={55}
        />
        <Row className="justify-between">
          <Column>
            <Header type="title-2" text={`Provided By ${employer}`} />
            <Spacer size={16} />
            <TextBox text="Your employer offers even more programs and benefits you can explore here" />
          </Column>
          <Image
            className="hidden sm:block"
            src={bcbstBlueLogo}
            alt="Provider logo"
            width={170}
            height={55}
          />
        </Row>
        <Spacer size={32} />
        <SlidingCarousel>
          {benefits.map((item) => (
            <BenefitsProviderInfoCard
              key={item.id}
              id={item.id}
              className="mr-4 shrink-0"
              contact={item.contact}
              providedBy={item.providedBy}
              url={item.url}
            />
          ))}
        </SlidingCarousel>
        <Spacer size={32} />
        <AppLink
          label="View Employer Provided Benefits"
          className="body-bold p-0 sm:p-2"
        />
      </Column>
    </Card>
  );
};
