import { ViewCareOptions } from '@/app/findcare/components/ViewCareOptions';
import { VirtualCareOptions } from '@/app/findcare/components/VirtualCareOptions';
import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import MentalCareIcon from '../../../public/assets/mental_health.svg';
import PrimaryCareIcon from '../../../public/assets/primary_care.svg';

const FindCare = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <ViewCareOptions
              className="large-section"
              options={[
                {
                  title: 'Primary Care Options',
                  description:
                    'Learn more about Primary Care Providers and view your options.',
                  image: (
                    <Image
                      className="max-md:w-[80px] max-md:h-[80px]"
                      src={PrimaryCareIcon}
                      alt="Primary Care"
                    />
                  ),
                },
                {
                  title: 'Mental Care Options',
                  description:
                    'Learn more about Mental Health Providers and view your options.',
                  image: (
                    <Image
                      className="max-md:w-[80px] max-md:h-[80px]"
                      src={MentalCareIcon}
                      alt="Mental Care"
                    />
                  ),
                },
              ]}
            />
          </Column>
        </section>
        <section>
          <VirtualCareOptions
            className="large-section"
            options={[
              {
                id: '1',
                title: 'AbleTo',
                description:
                  // eslint-disable-next-line quotes
                  "AbleTo's personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.",
                url: 'null',
              },
              {
                id: '2',
                title: 'Blue of Tennessee Medical Centers Virtual Visits ',
                description:
                  'At Blue of Tennessee Medical Centers, you can see a primary care provider, some specialists and get urgent care help. You can even get help with your health plan. ',
                url: 'null',
              },
              {
                id: '3',
                title: 'Hinge Health Back & Joint Care',
                description:
                  'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
                url: 'null',
              },
              {
                id: '4',
                title: 'yyt',
                description: 'xxx',
                url: 'null',
              },
            ]}
          />
        </section>
      </Column>
      <Spacer size={32}></Spacer>
    </main>
  );
};

export default FindCare;
