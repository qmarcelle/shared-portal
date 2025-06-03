'use client';

import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import {
  findFormIcon,
  glossaryIcon,
  questionsIcon,
} from '@/components/foundation/Icons';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ResourceMiniCard } from '../support/components/ResourceMiniCard';
import { AmplifyAdvisors } from './components/AmplifyAdvisors';
import { AmplifyHealthAppInformation } from './components/AmplifyHealthAppInformation';

const AmplifyHealthSupport = () => {
  const router = useRouter();
  const navigateToSendEmailPage = () => {
    router.push('/member/support/email');
  };
  const getHeroBannerContent = () => {
    return (
      <section className="justify-between md:flex md:flex-row">
        <Column>
          <Header className="title-1" text="Support" />
          <Spacer size={16}></Spacer>
          <TextBox
            className="max-w-[400px]"
            text="Your advisors are here to answer your questions. Chat online or call 1-866-258-3267, anytime 24/7."
          />
          <Spacer size={32}></Spacer>
          <section className="md:flex md:flex-row">
            <Button label="Start a Chat" type="card" callback={() => {}} />
            <Spacer axis="horizontal" size={32} />
            <Button
              className="!bg-transparent outline outline-primary-content mt-[10px] md:mt-[0px]"
              label="Send an Email"
              callback={navigateToSendEmailPage}
            />
          </section>
        </Column>
        <Spacer axis="horizontal" size={32}></Spacer>
        <Image
          className="min-h-[200px] self-end object-cover md:max-lg:mt-20 sm:self-auto basis-1/2 min-w-0"
          src="/assets/amplify_health_advisors_group.png"
          alt="Amplify Health App"
        />
      </section>
    );
  };

  return (
    <main className="flex flex-col justify-center items-center page">
      <section className="flex flex-col w-full">
        {/* Header Component Starts */}
        <WelcomeBanner
          className="surface-gradient-amplify min-h-[450px] px-4 md:min-h-[325px] lg:min-h-[250px]"
          body={getHeroBannerContent()}
        />
        {/* Header Component Ends */}

        {/* Content Wrapper */}
        <div className="app-content self-center relative">
          {/* Advisors Card as Overlay */}
          <div className="relative -top-[5rem] w-full z-10">
            <AmplifyAdvisors />
          </div>

          {/* Amplify Health Support Body Component */}
          <Column className="w-full">
            <Spacer size={32}></Spacer>
            <section className="flex flex-row items-start app-body">
              <Column className="flex-grow page-section-63_33 items-stretch">
                <AmplifyHealthAppInformation />
              </Column>
            </section>
          </Column>

          {/* Resources Section */}
          <Card className="large-section">
            <Column>
              <Header className="title-2" text="Resources" />
              <Spacer size={16}></Spacer>
              <TextBox text="Find answers to your health insurance questions or find a form." />
              <Spacer size={32}></Spacer>
              <Column className="gap-y-4 md:gap-4 md:flex-row">
                <ResourceMiniCard
                  className="basis-auto sm:basis-0 shrink sm:shrink-0 grow"
                  icon={<Image src={questionsIcon} alt="" />}
                  label="Frequently Asked Questions"
                  link="/faq"
                  external={false}
                />
                <ResourceMiniCard
                  className="basis-auto sm:basis-0 shrink sm:shrink-0 grow"
                  icon={<Image src={glossaryIcon} alt="" />}
                  label="Health Insurance Glossary"
                  link="https://www.healthcare.gov/glossary"
                  external={true}
                />
                <ResourceMiniCard
                  className="basis-auto sm:basis-0 shrink sm:shrink-0 grow"
                  icon={<Image src={findFormIcon} alt="" />}
                  label="Find a Form"
                  link="https://www.bcbst.com/use-insurance/documents-forms"
                  external={true}
                />
              </Column>
            </Column>
          </Card>
        </div>

        {/* Feedback Section */}
        <div className="w-full surface-gradient-amplify-flipped">
          <Column className="mt-16 text-white items-center px-4 gap-4">
            <TextBox
              type="title-2"
              className="text-center"
              text="Have feedback about our website?"
            />
            <TextBox
              className="text-center"
              text="We want to hear from you. Share your feedback about your experience using our website."
            />
            <Button
              type="primary"
              className="!bg-transparent outline outline-primary-content my-8 max-w-[256px]"
              label="Share Your Feedback"
              callback={() => {}}
            />
          </Column>
        </div>
      </section>
    </main>
  );
};

export default AmplifyHealthSupport;
