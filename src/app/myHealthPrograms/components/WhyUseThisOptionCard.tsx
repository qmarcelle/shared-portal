import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { accessGranted } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';

interface WhyUseThisOptionProps extends IComponent {
  whyThisOptionDetails: string[];
}

export const WhyUseThisOptionCard = ({
  whyThisOptionDetails,
}: WhyUseThisOptionProps) => {
  return (
    <Card className="my-health-programs-cost-option">
      <Column>
        <Header
          text="Why Use This Option"
          type="title-2"
          className="!font-light !text-[26px]/[40px]"
        />
        <Spacer size={16} />
        <section>
          <ul>
            {whyThisOptionDetails.map((item, index) => {
              return (
                <Column key={index}>
                  <li>
                    <Row>
                      <Image src={accessGranted} className="icon" alt="Info" />
                      <TextBox className="pt-1 ml-2" text={item} />
                    </Row>
                  </li>
                  <Spacer size={8} />
                </Column>
              );
            })}
          </ul>
        </section>
      </Column>
    </Card>
  );
};
