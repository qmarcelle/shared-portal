import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';

interface OtherFaqTopicsProps extends IComponent {
  faqTopics: string[];
  goToFaqPage: (item: string) => void;
}
export const OtherFaqTopics = ({
  faqTopics,
  goToFaqPage: GoToFaqPage,
}: OtherFaqTopicsProps) => {
  return (
    <Card className="mt-4">
      <Column>
        <Spacer size={16} />
        <Header
          text="Other FAQ Topics"
          type="title-2"
          className="!font-light !text-[26px]/[40px] ml-4"
        />
        <Spacer size={16} />
        <Row>
          <ul className="ml-4">
            {faqTopics.map((item, index) => {
              return (
                <Column key={index}>
                  <li>
                    <Row>
                      <AppLink
                        label={item}
                        linkUnderline="!no-underline"
                        callback={() => {
                          GoToFaqPage(item);
                        }}
                      />
                    </Row>
                  </li>
                  <Spacer size={8} />
                </Column>
              );
            })}
          </ul>
        </Row>
      </Column>
    </Card>
  );
};
