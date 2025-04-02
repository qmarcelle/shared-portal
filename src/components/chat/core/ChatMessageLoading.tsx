import { Card } from '../../../components/foundation/Card';
import { Loader } from '../../../components/foundation/Loader';

export const ChatMessageLoading: React.FC = () => {
  return (
    <Card className="chat-message-loading">
      <div className="message-content">
        <Loader size="small" />
        <div className="message-skeleton">
          <div className="skeleton-line" />
          <div className="skeleton-line" />
          <div className="skeleton-line" />
        </div>
      </div>
    </Card>
  );
};
