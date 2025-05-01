import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FaqTopicsPage } from '../components/FaqTopicsPage';
import { FaqTopicType } from '../models/faq_details';

export const metadata: Metadata = {
  title: 'FAQ Topics | Member Portal',
  description: 'Browse frequently asked questions by topic',
};

interface Props {
  params: {
    type: string;
  };
}

export default function FaqTopicsTypePage({ params }: Props) {
  const type = params.type;
  const validTypes: string[] = Object.values(FaqTopicType).map<string>(
    (t: FaqTopicType): string => t.toLowerCase(),
  );

  if (!validTypes.includes(type.toLowerCase())) {
    notFound();
  }

  return <FaqTopicsPage topicType={type as FaqTopicType} />;
}
