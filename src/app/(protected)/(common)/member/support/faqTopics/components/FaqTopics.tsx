import { Column } from '@/components/foundation/Column';
import { useEffect, useState } from 'react';
import {
  FaqHeaderCardDetails,
  FaqTopicDetails,
  FaqTopicType,
} from '../models/faq_details';
import { SupportFaqTopicDetails } from '../models/support_faq_topic_details';
import { FaqCard } from './FaqCard';
import { FaqHeaderCard } from './FaqHeaderCard';
import { OtherFaqTopics } from './OtherFaqTopics';

interface FaqTopicsProps {
  initialTopicType?: FaqTopicType;
}

export const FaqTopics = ({ initialTopicType }: FaqTopicsProps) => {
  const [topics, setTopics] = useState<FaqTopicDetails>();

  useEffect(() => {
    if (initialTopicType) {
      setTopics(SupportFaqTopicDetails.get(initialTopicType));
    }
  }, [initialTopicType]);

  const activeFaqTopic = (faqType: FaqTopicType | string | null) => {
    setTopics(SupportFaqTopicDetails.get(faqType));
  };

  return (
    <Column className="app-content app-base-font-color">
      <FaqHeaderCard
        faqHeaderDetails={
          topics?.faqTopicHeaderDetails ?? ({} as FaqHeaderCardDetails)
        }
      />
      <section className="flex flex-row items-start app-body">
        <Column className="flex-grow page-section-63_33 items-stretch">
          <FaqCard
            services={topics?.faqTopCardDetails ?? []}
            topicType={topics?.topicType}
          />
          <FaqCard
            services={topics?.faqSecondCardDetails}
            topicType={topics?.topicType}
          />
          <FaqCard
            services={topics?.faqThirdCardDetails}
            topicType={topics?.topicType}
          />
        </Column>
        <Column className="flex-grow page-section-36_67 items-stretch">
          <OtherFaqTopics
            faqTopics={FaqTopicType}
            goToFaqPage={activeFaqTopic}
          />
        </Column>
      </section>
    </Column>
  );
};
