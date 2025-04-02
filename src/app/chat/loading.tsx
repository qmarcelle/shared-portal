import { Card } from '../../../components/foundation/Card';
import { Loader } from '../../../components/foundation/Loader';

export default function ChatLoading() {
  return (
    <Card className="chat-loading-container">
      <div className="chat-loading-content">
        <Loader size="large" />
        <p>Initializing chat...</p>
      </div>
    </Card>
  );
}
