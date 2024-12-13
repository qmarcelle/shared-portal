import { Card } from '@/components/foundation/Card';
import { Circle } from '@/components/foundation/Circle';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';

interface GoodforThisOptionProps extends IComponent {
  goodforThisOptionDetails: string[];
}
export const GoodforThisOptionCard = ({
  goodforThisOptionDetails,
}: GoodforThisOptionProps) => {
  return (
    <Card className="my-health-programs-good-option">
      <Column>
        <Spacer size={16} />
        <Header
          text="This Option is Generally Good for:"
          type="title-2"
          className="!font-light !text-[26px]/[40px] ml-4"
        />
        <Spacer size={16} />
        <Row>
          <ul className="ml-4">
            {goodforThisOptionDetails.map((item, index) => {
              return (
                <Column key={index}>
                  <li>
                    <Row>
                      <Column className="no-shrink">
                        <Circle
                          width={5}
                          height={5}
                          color="#5DC1FD"
                          radius={50}
                          top={7}
                          right={0}
                        />
                      </Column>
                      <TextBox text={item} className="ml-3" />
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
