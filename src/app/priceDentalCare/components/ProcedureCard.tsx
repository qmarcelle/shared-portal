import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';

interface ProcedureCardProps extends IComponent {
  label: string;
  body: string;
  icon: string;
  link: string;
}

export const ProcedureCard = ({
  label,
  body,
  icon,
  link,
}: ProcedureCardProps) => {
  return (
    <Card type="elevated" key={label} className="small-section">
      <Row>
        <Image className="size-10" src={icon} alt="" />
        <Column className="ml-4">
          <Title
            className="font-bold primary-color"
            text={label}
            suffix={<Image src={link} alt="" />}
          />
          <TextBox className="body-1" text={body} />
        </Column>
      </Row>
    </Card>
  );
};
