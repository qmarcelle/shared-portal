import { IComponent } from '../../../components/IComponent';
import { Column } from '../../../components/foundation/Column';
import { NotificationCard, NotificationCardProps } from './NotificationCard';

interface NotificationSectionProps extends IComponent {
  notificationCards: NotificationCardProps[];
}

export const NotificationSection = ({
  className,
  notificationCards,
}: NotificationSectionProps) => {
  return (
    <Column className={`space-y-4 ${className}`}>
      {notificationCards.map((data, index) => (
        <NotificationCard
          key={index}
          title={data.title}
          body={data.body}
          time={data.time}
          readIndicator={data.readIndicator}
          link={data.link}
        />
      ))}
    </Column>
  );
};
