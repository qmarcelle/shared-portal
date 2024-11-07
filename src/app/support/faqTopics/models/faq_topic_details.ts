import { FAQDetails } from './faq_details';
import { FaqHeaderCardDetails } from './faq_header_card_details';
import { FaqTopicType } from './faq_topic_type';

export interface FaqTopicDetails {
  topicType: FaqTopicType;
  faqTopicHeaderDetails: FaqHeaderCardDetails;
  faqTopCardDetails: FAQDetails[];
  faqBottomCardDetails?: FAQDetails[];
  faqType?: string;
}
