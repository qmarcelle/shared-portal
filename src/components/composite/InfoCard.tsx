import Image from 'next/image';
import Link from 'next/link';
import { IComponent } from '../IComponent';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

export interface InfoCardProps extends IComponent {
  label: string;
  body: string;
  icon: string;
  link?: string;
  suffix?: JSX.Element;
}

export const InfoCard = ({
  label,
  body,
  icon,
  link,
  suffix,
}: InfoCardProps) => {
  return (
    <Link href={link ?? ''}>
      <Card type="elevated" key={label} className="small-section">
        <Row>
          <Image className="size-10" src={icon} alt="link" />
          <Column className="ml-4">
            <Row className="link-row-head">
              {label}
              <Spacer axis="horizontal" size={8} />
              {suffix && suffix}
            </Row>
            <TextBox className="body-1" text={body} />
          </Column>
        </Row>
      </Card>
    </Link>
  );
};
