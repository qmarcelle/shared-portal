'use client';

import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { useRouter } from 'next/navigation';

interface ViewCareOptionsProps extends IComponent {
  options: {
    title: string;
    description: string;
    image: JSX.Element;
    url: string;
    visible?: boolean;
  }[];
}

export const ViewCareOptions = ({
  className,
  options,
}: ViewCareOptionsProps) => {
  const router = useRouter();
  const visibleOptions = options.filter((item) => item.visible);

  if (visibleOptions.length === 0) return null;

  return (
    <Column className={`${className ?? ''} cursor-pointer`}>
      <Column className="flex flex-col">
        <Title className="title-1" text="View Care Options" />
        <Spacer size={32} />
        {options.map((item, index) => (
          <Card
            key={index}
            className="mb-4"
            type="elevated"
            onClick={() => router.replace(item.url)}
          >
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
