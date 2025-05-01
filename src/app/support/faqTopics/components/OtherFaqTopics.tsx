import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { getSearchParams } from '@/utils/navigation';
import { useEffect, useState } from 'react';
import { FaqTopicType } from '../models/faq_details';

interface OtherFaqTopicsProps extends IComponent {
  faqTopics: typeof FaqTopicType;
  goToFaqPage: (item: string) => void;
}

export const OtherFaqTopics = ({
  faqTopics,
  goToFaqPage,
}: OtherFaqTopicsProps) => {
  const faqTopicsList: string[] = Object.keys(faqTopics).map<string>(
    (key: string): string => faqTopics[key as keyof typeof FaqTopicType],
  );
  const [currentPageId, setCurrentPageId] = useState<string | null>('');
  let faqType: string | null;

  useEffect(() => {
    const params = getSearchParams();
    faqType = params?.get('faqtype') ?? null;
    console.log('other faq ---- ' + faqType);
    setCurrentPageId(faqType);
  }, []);

  return (
    <Card className="mt-4">
      <Column className="ml-6">
        <Spacer size={16} />
        <Header
          text="Other FAQ Topics"
          type="title-2"
          className="!font-light !text-[26px]/[40px] ml-4"
        />
        <Spacer size={16} />
        <Row>
          <ul className="ml-6 !font-thin">
            {faqTopicsList.map((item: string, index: number) => {
              return (
                <Column key={index} className="!font-thin">
                  <li>
                    <Row>
                      <AppLink
                        label={item}
                        linkUnderline="!no-underline manage-faq"
                        className={`${currentPageId === item ? 'border-l-4  focus:outline-none border-primary font-bold p-0 pl-1' : 'p-0 '}`}
                        callback={() => {
                          goToFaqPage(item);
                          setCurrentPageId(item);
                        }}
                      />
                    </Row>
                  </li>
                  <Spacer size={24} />
                </Column>
              );
            })}
          </ul>
        </Row>
      </Column>
    </Card>
  );
};
