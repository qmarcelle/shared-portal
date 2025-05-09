import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Header } from '../foundation/Header';
import { Row } from '../foundation/Row';
import { Spacer, SpacerX } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
import { IComponent } from '../IComponent';

interface DocumentsCardListProps extends IComponent {
  documentName: string;
  receivedDate: string;
  memberName: string;
  icon?: JSX.Element;
}

export const DocumentInfoCard = ({
  documentName,
  receivedDate,
  memberName,
  className,
  icon = <img src="/assets/document_file.svg" alt="link" />,
  onClick,
}: DocumentsCardListProps) => {
  return (
    <Card
      className={`cursor-pointer ${className}`}
      type="elevated"
      onClick={onClick}
    >
      <Column className="m-4 w-[639px]">
        <Spacer size={16} />
        <Row>
          <Column>{icon}</Column>
          <SpacerX size={8} />
          <Column>
            <Header
              text={documentName}
              type="title-3"
              className="!font-bold primary-color"
            />
            <Spacer size={16} />
            <TextBox className="body-1" text={receivedDate} />
            <Spacer size={8} />
            <TextBox className="body-1" text={memberName} />
          </Column>
        </Row>
        <Spacer size={16} />
      </Column>
    </Card>
  );
};
