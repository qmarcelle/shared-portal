import { Card } from '@/components/foundation/Card';
import { Loader } from '@/components/foundation/Loader';

export const ChatLoading = () => {
  return (
    <Card className="chat-loading-container">
      <div className="chat-loading-content">
        <Loader items={3} maxWidth="100px" />
        <p>Initializing chat...</p>
      </div>
    </Card>
  );
};
