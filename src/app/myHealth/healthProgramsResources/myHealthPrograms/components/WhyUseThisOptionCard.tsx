import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { accessGranted } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

interface WhyUseThisOptionProps extends IComponent {
  whyThisOptionDetails: string[];
  programType?: string;
}

export const WhyUseThisOptionCard = ({
  whyThisOptionDetails,
  programType,
}: WhyUseThisOptionProps) => {
  function QuestSelect(programType: string | undefined) {
    return (
      programType == 'QuestSelect' && (
        <Column>
          <Divider className="mt-4" />
          <TextBox
            className="body-2 mt-8"
            text="*If you get lab testing out of state, call the Member Service number on the back of your Member ID card to make sure Quest Diagnostics is in network in that state"
          ></TextBox>
        </Column>
      )
    );
  }

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
                      <img src={accessGranted} className="icon" alt="Info" />
                      <TextBox className="pt-1 ml-2" text={item} />
                    </Row>
                  </li>
                  <Spacer size={8} />
                </Column>
              );
            })}
          </ul>
          {QuestSelect(programType)}
        </section>
      </Column>
    </Card>
  );
};
