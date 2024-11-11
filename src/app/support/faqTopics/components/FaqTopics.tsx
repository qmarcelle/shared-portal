import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { useEffect, useState } from 'react';
import { FaqHeaderCardDetails } from '../models/faq_header_card_details';
import { FaqTopicDetails } from '../models/faq_topic_details';
import { FaqTopicType } from '../models/faq_topic_type';
import { OtherFaqTopicDetails } from '../models/other_faq_topic_details';
import { SupportFaqTopicDetails } from '../models/support_faq_topic_details';
import { FaqCard } from './FaqCard';
import { FaqHeaderCard } from './FaqHeaderCard';
import { OtherFaqTopics } from './OtherFaqTopics';

let activeFaqTopic: { (faqType: string | null): void; (item: string): void };

export const FaqTopics = () => {
  const [topics, setTopics] = useState<FaqTopicDetails>();
  let faqType: string | null;
  useEffect(() => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    faqType = params.get('faqtype');
    activeFaqTopic(faqType);
  }, []);

  activeFaqTopic = (faqType: string | null) => {
    switch (faqType) {
      case 'Benefits':
      case 'Benefits & Coverage':
        console.log('topics  ----' + topics);
        return setTopics(
          SupportFaqTopicDetails.get(FaqTopicType.BenefitsAndCoverage),
        );
      case 'Claims':
        return setTopics(SupportFaqTopicDetails.get(FaqTopicType.Claims));

      case 'ID Cards':
        return setTopics(SupportFaqTopicDetails.get(FaqTopicType.IdCards));

      case 'My Plan Information':
        return setTopics(
          SupportFaqTopicDetails.get(FaqTopicType.MyPlanInformation),
        );

      case 'Pharmacy':
        return setTopics(SupportFaqTopicDetails.get(FaqTopicType.Pharmacy));

      case 'Prior Authorization':
        return setTopics(
          SupportFaqTopicDetails.get(FaqTopicType.PriorAuthorization),
        );

      case 'Sharing, Permissions & Security':
        return setTopics(
          SupportFaqTopicDetails.get(FaqTopicType.SharingPermisionsSecurity),
        );
    }
  };

  return (
    <Column className="app-content app-base-font-color">
      <FaqHeaderCard
        faqHeaderDetails={
          topics?.faqTopicHeaderDetails ?? ({} as FaqHeaderCardDetails)
        }
      />
      <Spacer size={16} />
      <section className="flex flex-row items-start app-body">
        <Column className="flex-grow page-section-63_33 items-stretch">
          <FaqCard
            services={topics?.faqTopCardDetails ?? []}
            topicType={topics?.topicType}
          />
          <FaqCard
            services={topics?.faqBottomCardDetails}
            topicType={topics?.topicType}
          />
        </Column>
        <Column className=" flex-grow page-section-36_67 items-stretch ">
          <OtherFaqTopics
            faqTopics={OtherFaqTopicDetails}
            goToFaqPage={activeFaqTopic}
          />
        </Column>
      </section>
    </Column>
  );
};
