import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { SupportFaqTopicDetails } from '../models/support_faq_topic_details';

interface OtherFaqTopicsProps extends IComponent {
  faqtype: string;
  goToFaqPage: (item: string) => void;
}
export const OtherFaqTopics = ({
  faqtype,
  goToFaqPage,
}: OtherFaqTopicsProps) => {

  console.log('...SupportFaqTopicDetails' ,...SupportFaqTopicDetails)

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
            {[...SupportFaqTopicDetails].map(([paramKey, item]) => {
              return (
                <Column key={paramKey} className="!font-thin">
                  <li>
                    <Row>
                      <AppLink
                        label={item.topicType}
                        linkUnderline="!no-underline manage-faq"
                        className={`${faqtype === paramKey ? 'border-l-4  focus:outline-none border-primary font-bold p-0 pl-1' : 'p-0 '}`}
                        callback={() => {
                          goToFaqPage(paramKey!);
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
