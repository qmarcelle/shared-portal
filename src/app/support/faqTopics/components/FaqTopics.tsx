import { Column } from '@/components/foundation/Column';
import { useParams, useRouter } from 'next/navigation';
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

let activeFaqTopic: (item: FaqTopicType | string | null) => void;
export const FaqTopics = () => {
  
  const router = useRouter()
  const {faqType} = useParams<{faqType:string}>()
 
  const [topic, setTopic] = useState<FaqTopicDetails>(SupportFaqTopicDetails.get(faqType)!);
  

  useEffect(() => {
    
    activeFaqTopic(faqType!);
    
  }, []);

  activeFaqTopic = (faqType: FaqTopicType | string | null) => {
    setTopic(SupportFaqTopicDetails.get(faqType)!);

    window.history.pushState(null, "",`/member/support/FAQ/${faqType}`)
  };

  return (
    <Column className="app-content app-base-font-color">
      <FaqHeaderCard
        faqHeaderDetails={
          topic?.faqTopicHeaderDetails ?? ({} as FaqHeaderCardDetails)
        }
      />
      <section className="flex flex-row items-start app-body">
        <Column className="flex-grow page-section-63_33 items-stretch">
          <FaqCard
            services={topic?.faqTopCardDetails ?? []}
            topicType={topic?.topicType}
          />
          <FaqCard
            services={topic?.faqSecondCardDetails}
            topicType={topic?.topicType}
          />
          <FaqCard
            services={topic?.faqThirdCardDetails}
            topicType={topic?.topicType}
          />
        </Column>
        <Column className=" flex-grow page-section-36_67 items-stretch ">
          <OtherFaqTopics
            faqtype = {topic!.faqPathParam}
            goToFaqPage={activeFaqTopic}
          />
        </Column>
      </section>
    </Column>
  );
};
