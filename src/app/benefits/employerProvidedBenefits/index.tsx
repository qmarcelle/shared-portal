import { BenefitsProviderInfoCard } from '@/app/dashboard/components/BenefitsProviderInfoCard';
import { BenefitsProviderInfo } from '@/app/dashboard/models/BenefitsProviderInfo';
import { AppPage } from '@/components/foundation/AppPage';
import { Body } from '@/components/foundation/Body';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Section } from '@/components/foundation/Section';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

type EmployerProvidedBenefitsPageProps = {
  benefits?: BenefitsProviderInfo[];
};

export const EmployerProvidedBenfitsPage = ({
  benefits,
}: EmployerProvidedBenefitsPageProps) => {
  return (
    <AppPage>
      <Body>
        <Image
          className="block mb-6 mt-3 sm:hidden"
          src={bcbstBlueLogo}
          alt="Provider logo"
          width={170}
          height={55}
        />
        <Row className="justify-between">
          <Column>
            <TextBox type="title-1" text="Employer Provided Benefits" />
            <Spacer size={16} />
            <TextBox text="Your employer offers even more programs and benefits you can explore here." />
          </Column>
          <Image
            className="hidden sm:block self-start"
            src={bcbstBlueLogo}
            alt="Provider logo"
            width={170}
            height={55}
          />
        </Row>
        <Section>
          <ul className="flex flex-col gap-4 flex-grow page-section-63_33 items-stretch my-4">
            {benefits?.map((item) => (
              <BenefitsProviderInfoCard
                key={item.id}
                id={item.id}
                className="shrink-0"
                contact={item.contact}
                providedBy={item.providedBy}
                url={item.url}
              />
            ))}
          </ul>
          <Card className="small-section page-section-36_67">
            <Column>
              <TextBox
                type="title-2"
                text="Get Help with Employer Provided Benefits"
                className="mb-4"
              />
              <TextBox
                type="body-2"
                text="Contact your employer to get help with these programs."
              />
            </Column>
          </Card>
        </Section>
      </Body>
    </AppPage>
  );
};
