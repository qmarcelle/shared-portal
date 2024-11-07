import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { useEffect, useState } from 'react';
import { FaqHeaderCardDetails } from '../models/faq_header_card_details';
import { FaqTopicDetails } from '../models/faq_topic_details';
import { FaqTopicType } from '../models/faq_topic_type';
import { OtherFaqTopicDetails } from '../models/other_faq_topic_details';
import { SupportFaqTopicDetails } from '../models/support_faq_topic_details';
import { SupportFaqCard } from './FaqCard';
import { FaqHeaderCard } from './FaqHeaderCard';
import { OtherFaqTopics } from './OtherFaqTopics';

let activeFaqTopic: { (faqType: string | null): void; (item: string): void };

export const FaqTopics = () => {
  // eslint-disable-next-line prefer-const
  let [topics, setTopics] = useState<FaqTopicDetails>();
  let faqType: string | null;
  useEffect(() => {
    const urlSearchString = window.location.search;
    const params = new URLSearchParams(urlSearchString);
    faqType = params.get('faqtype');
    activeFaqTopic(faqType);
  }, []);

  activeFaqTopic = (faqType: string | null) => {
    if (faqType == 'Benefits & Coverage' || faqType == 'Benefits') {
      topics = SupportFaqTopicDetails.get(FaqTopicType.BenefitsAndCoverage);
    } else if (faqType == 'Claims') {
      topics = SupportFaqTopicDetails.get(FaqTopicType.Claims);
    } else if (faqType == 'ID Cards' || faqType == 'IDCards') {
      topics = SupportFaqTopicDetails.get(FaqTopicType.IdCards);
    } else if (
      faqType == 'My Plan Information' ||
      faqType == 'MyPlanInformation'
    ) {
      topics = SupportFaqTopicDetails.get(FaqTopicType.MyPlanInformation);
    } else if (faqType == 'Pharmacy') {
      topics = SupportFaqTopicDetails.get(FaqTopicType.Pharmacy);
    } else if (
      faqType == 'Prior Authorization' ||
      faqType == 'PriorAuthorization'
    ) {
      topics = SupportFaqTopicDetails.get(FaqTopicType.PriorAuthorization);
    } else if (
      faqType == 'Sharing, Permissions & Security' ||
      faqType == 'SharingPermissions&Security'
    ) {
      topics = SupportFaqTopicDetails.get(
        FaqTopicType.SharingPermisionsSecurity,
      );
    }
    setTopics(topics);
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
          <SupportFaqCard
            services={topics?.faqTopCardDetails ?? []}
            topicType={topics?.topicType}
          />
          <SupportFaqCard
            services={topics?.faqBottomCardDetails}
            topicType={topics?.topicType}
          />
        </Column>
        <Column className=" flex-grow page-section-36_67 items-stretch ">
          <OtherFaqTopics
            faqTopics={OtherFaqTopicDetails}
            GoToFaqPage={activeFaqTopic}
          />
        </Column>
      </section>
    </Column>
  );
};
