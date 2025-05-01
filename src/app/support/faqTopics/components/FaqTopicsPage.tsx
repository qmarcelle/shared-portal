import { FaqTopicType } from '../models/faq_details';
import { FaqTopics } from './FaqTopics';

interface FaqTopicsPageProps {
  topicType: FaqTopicType;
}

export function FaqTopicsPage({ topicType }: FaqTopicsPageProps) {
  return (
    <main className="flex flex-col justify-center items-center page">
      <FaqTopics initialTopicType={topicType} />
    </main>
  );
}
