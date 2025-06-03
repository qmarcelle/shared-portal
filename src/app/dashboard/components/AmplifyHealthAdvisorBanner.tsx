import { ImageBanner } from '@/components/composite/ImageBanner';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import Link from 'next/link';

export const AmplifyHealthAdvisorBanner = () => {
  const getBannerContent = () => {
    return (
      <Column>
        <Header
          text="My AmplifyHealth Advisor"
          type="title-2"
          className="!font-light !text-[32px]/[40px]"
        />
        <Spacer size={16}></Spacer>
        <p>
          Have a question or need advice? Your AmplifyHealth Advisor is here for
          you 24/7. You can start a chat or call us at [1-866-258-3267].
        </p>
        <Spacer size={32}></Spacer>
        <Link href="/member/amplifyhealthsupport" className="link link-hover">
          <p className="pb-2 pt-2">Learn More About My AmplifyHealth Advisor</p>
        </Link>
      </Column>
    );
  };

  const getImage = () => {
    return <section className="health-advisor-image max-md:w-full"></section>;
  };
  return (
    <ImageBanner
      className="health-advisor-card basis-0 px-3 pt-3 sm:shrink-1 md:basis-[100%] md:ml-0 sm:basis-[96.7%] sm:ml-4 sm:pr-0 sm:mt-4 sm:pl-8 sm:pt-8"
      body={getBannerContent()}
      image={getImage()}
    />
  );
};
