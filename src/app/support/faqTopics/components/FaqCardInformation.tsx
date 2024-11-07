import { Circle } from '@/components/foundation/Circle';
import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '@/components/IComponent';
import { ReactNode } from 'react';

interface PharmacyFAQInformationProps extends IComponent {
  answerline1: JSX.Element | string | string[];
  answerline2: JSX.Element[] | ReactNode[];
  answerline3: JSX.Element | string;
}

export const FaqCardInformation = ({
  answerline1,
  answerline2,
  answerline3,
}: PharmacyFAQInformationProps) => {
  return (
    <Column className="flex flex-col">
      <Spacer size={16} />
      <Row>
        <RichText spans={[<span key={0}>{answerline1}</span>]} />
      </Row>
      <Spacer size={12} />
      <Row>
        <ul className="ml-4">
          {answerline2.map((item: JSX.Element[] | ReactNode, index: number) => {
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
                    <RichText
                      className="ml-4"
                      spans={[<span key={0}>{item}</span>]}
                    />
                  </Row>
                </li>
                <Spacer size={8} />
              </Column>
            );
          })}
        </ul>
      </Row>
      <Row>
        <label className="body-1">{answerline3}</label>
      </Row>
      <Spacer size={12} />
    </Column>
  );
};
