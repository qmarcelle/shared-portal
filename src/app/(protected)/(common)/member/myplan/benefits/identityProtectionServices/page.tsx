/**
 * benefits/identityProtectionServices
 * Identity protection services
 */
export const metadata = {
  title: 'Identity protection services | Consumer Portal',
  description: 'Identity protection services'
};

'use client';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { AboutIdentityProtection } from './components/AboutIdentityProtection';
import { EnrollmentOptions } from './components/EnrollmentOptions';

const IdentityProtectionServices = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Spacer size={32} />
        <Title
          className="title-1 max-md:mx-4 max-lg:mx-6"
          text="Identity Protection Services"
        />
        <Spacer size={16} />
        <TextBox
          className="max-md:mx-4 max-lg:mx-6"
          text="We work with Experian to keep your medical information secure, at no additional cost."
        />
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AboutIdentityProtection />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <EnrollmentOptions className="large-section" />
          </Column>
        </section>
      </Column>
    </main>
  );
};
export default IdentityProtectionServices;
