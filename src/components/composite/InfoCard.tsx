import Image from 'next/image';
import { IComponent } from '../IComponent';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Row } from '../foundation/Row';
import { TextBox } from '../foundation/TextBox';

interface InfoCardProps extends IComponent {
  label: string;
  body: string;
  icon: string;
  link?: string;
}

export const InfoCard = ({ label, body, icon, link }: InfoCardProps) => {
  return (
    <a href={link}>
      <Card type="elevated" key={label} className="small-section">
        <Row>
          <Image className="size-10" src={icon} alt="link" />
          <Column className="ml-4">
            <TextBox className="link-row-head" text={label} />
            <TextBox className="body-1" text={body} />
          </Column>
        </Row>
      </Card>
    </a>
  );
};
