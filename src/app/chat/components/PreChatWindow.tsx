import { AppLink } from '@/components/foundation/AppLink';
import { Body } from '@/components/foundation/Body';
import { Button } from '@/components/foundation/Button';
import { RichText } from '@/components/foundation/RichText';
import { Title } from '@/components/foundation/Title';
import { usePlanStore } from '@/userManagement/stores/planStore';
import { useChatStore } from '../stores/chatStore';

// src/components/PreChatWindow.tsx
export default function PreChatWindow() {
  const { plans, selectedPlanId, openPlanSwitcher } = usePlanStore();
  const { startChat } = useChatStore();

  const planName = plans.find((p) => p.id === selectedPlanId)?.name || '';

  return (
    <div className="pre-chat-window">
      <Title text="We're right here for you. Let's chat." className="mb-4" />

      <div className="plan-info">
        <Body className="mb-2">Start a chat to get help with the plan:</Body>
        <div className="plan-row">
          <RichText spans={[planName]} className="font-bold mr-2" />
          {plans.length > 1 && (
            <Button
              label="Switch"
              callback={openPlanSwitcher}
              type="ghost"
              className="switch-link"
            />
          )}
        </div>
      </div>

      <Button
        label="Start Chat"
        callback={startChat}
        type="primary"
        className="mt-4"
      />

      <div className="terms-note mt-3">
        <span>By starting a chat, you agree with our </span>
        <AppLink
          label="Terms & Conditions"
          url="/terms"
          className="underline"
          type="link"
        />
        <span> for chat.</span>
      </div>
    </div>
  );
}
