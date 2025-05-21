import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import File from '../../../../../public/assets/document_file.svg';

export interface DocumentCardProps extends IComponent {
  title: string;
  received: string;
  for: string;
  link?: string;
}

export const DocumentCard = ({
  className,
  title,
  received: body,
  for: time,
  link,
  onClick,
}: DocumentCardProps) => {
  return (
    <Card type="elevated" className={className} onClick={onClick}>
      <Column className="p-8">
        <Row className="items-center">
          {
            <Image
              className="w-6"
              src={File}
              alt=""
              style={{ marginRight: '10px' }}
            ></Image>
          }
          <a href={link}>
            <Header
              className="primary-color !font-bold"
              type="title-3"
              text={title}
            />
          </a>
        </Row>
        <Spacer size={16} />
        <TextBox text={body} />
        <Spacer size={8} />
        <TextBox
          className="text-[--tertiary-color-3]"
          type="body-1"
          text={time}
        />
      </Column>
    </Card>
  );
};
