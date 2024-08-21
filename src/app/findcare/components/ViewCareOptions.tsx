'use client';

import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';

interface ViewCareOptionsProps extends IComponent {
  options: { title: string; description: string; image: JSX.Element }[];
}

export const ViewCareOptions = ({
  className,
  options,
}: ViewCareOptionsProps) => {
  return (
    <Column className={className}>
      <Column className="flex flex-col">
        <Title className="title-1" text="View Care Options" />
        <Spacer size={32} />
        {options.map((item, index) => (
          <Card key={index} className="mb-4" type="elevated">
            <Row className="align-top m-4 mt-8">
              <Column>{item.image}</Column>
              <Spacer size={16} axis="horizontal" />
              <Column>
                <TextBox
                  className="font-bold primary-color"
                  text={item.title}
                />
                <TextBox className="mt-2" text={item.description} />
              </Column>
            </Row>
          </Card>
        ))}
      </Column>
    </Column>
  );
};
