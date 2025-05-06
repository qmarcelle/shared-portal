import { IComponent } from '@/components/IComponent';
import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';

import { Header } from '@/components/foundation/Header';

interface PillBoxProps extends IComponent {
  className: string;
  title: string;
  icon?: JSX.Element;
  pillObjects: FindCarePillBoxData[];
}

export interface FindCarePillBoxData {
  label: string;
  callback?: () => void | Promise<void> | null;
}

export const FindCarePillBox = ({
  className,
  title,
  pillObjects,
  icon,
}: PillBoxProps) => {
  return (
    <Card className={className}>
      <section className="gap-8">
        <Row className="align-top items-center">
          {icon}
          <Spacer axis="horizontal" size={16} />
          <Header text={title} type="title-3" className="!font-bold" />
        </Row>
        <Spacer size={16} />
        <Row className="flex-wrap gap-x-2 gap-y-4">
          {pillObjects.map((pillData, index) => (
            <Button
              key={index}
              type="pill"
              label={pillData.label}
              callback={pillData.callback}
              className="h-[28px] font-bold primary-color"
            />
          ))}
        </Row>
      </section>
    </Card>
  );
};
