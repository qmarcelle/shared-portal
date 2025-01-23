import { BenefitsProviderInfoCard } from '@/app/dashboard/components/BenefitsProviderInfoCard';
import { FindMedicalProvidersComponent } from '@/app/dashboard/components/FindMedicalProvidersComponent';
import { BenefitsProviderInfo } from '@/app/dashboard/models/BenefitsProviderInfo';
import { ErrorInfoCard } from '@/components/composite/ErrorInfoCard';
import { AppPage } from '@/components/foundation/AppPage';
import { Body } from '@/components/foundation/Body';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { dollarGeneralLogo } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Section } from '@/components/foundation/Section';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

type EmployerProvidedBenefitsPageProps = {
  benefits?: BenefitsProviderInfo[];
  groupId?: string;
};

export const EmployerProvidedBenfitsPage = ({
  benefits,
  groupId,
}: EmployerProvidedBenefitsPageProps) => {
  return (
    <AppPage>
      <Body>
        {/* Show logo only for Dollar General Group Id */}
        {groupId == '87898' && (
          <Image
            className="block mb-6 mt-3 sm:hidden"
            src={dollarGeneralLogo}
            alt="Provider logo"
            width={170}
            height={55}
          />
        )}
        <Row className="justify-between">
          <Column>
            <TextBox type="title-1" text="Employer Provided Benefits" />
            <Spacer size={16} />
            <TextBox text="Your employer offers even more programs and benefits you can explore here." />
          </Column>
          {groupId == '87898' && (
            <Image
              className="hidden sm:block self-start"
              src={dollarGeneralLogo}
              alt="Provider logo"
              width={170}
              height={55}
            />
          )}
        </Row>
        <Section>
          <ul className="flex flex-col gap-4 flex-grow page-section-63_33 items-stretch my-4">
            {benefits?.length ? (
              benefits.map((item) => (
                <BenefitsProviderInfoCard
                  key={item.id}
                  id={item.id}
                  className="shrink-0"
                  contact={item.contact}
                  providedBy={item.providedBy}
                  url={item.url}
                />
              ))
            ) : (
              <ErrorInfoCard
                className="mt-4"
                errorText="There was a problem loading your information. Please try refreshing the page or returning to this page later."
              />
            )}
          </ul>
          <Column className="page-section-36_67">
            <Card className="small-section">
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
            <FindMedicalProvidersComponent />
          </Column>
        </Section>
      </Body>
    </AppPage>
  );
};
