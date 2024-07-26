import { IComponent } from '../../../../components/IComponent';
import { Card } from '../../../../components/foundation/Card';
import { Column } from '../../../../components/foundation/Column';
import { Header } from '../../../../components/foundation/Header';
import { Row } from '../../../../components/foundation/Row';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';

export interface NotificationCardProps extends IComponent {
  title: string;
  body: string;
  time: string;
  readIndicator: boolean;
  link?: string;
}

export const NotificationCard = ({
  className,
  title,
  body,
  time,
  readIndicator,
  link,
}: NotificationCardProps) => {
  return (
    <Card type="elevated" className={className}>
      <Column className="p-8">
        <Row className="items-center">
          {/* if readIndicator = true (the notification has been read) then do not show red dot otherwise do */}
          {!readIndicator && (
            <div className="bg-[--color-status-error] circle rounded-full w-3 h-3 aspect-square mr-2" />
          )}
          <a href={link}>
            <Header
              className="text-[--primary-color] !font-bold"
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
