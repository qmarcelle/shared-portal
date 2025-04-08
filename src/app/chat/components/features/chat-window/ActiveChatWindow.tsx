'use client';

import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import React from 'react';
import { ChatPlan } from '../../../types/types';

interface ActiveChatWindowProps {
  currentPlan: ChatPlan | null;
  hasMultiplePlans: boolean;
  children: React.ReactNode; // This will contain the actual chat interface/messages
}

/**
 * ActiveChatWindow Component
 * Wraps the chat interface with plan information during active chat
 *
 * @userStory ID: 31295 - Display Plan the Member is Chatting About in the Active Chat Window if They Have Access to Multiple Plans
 * @userStory ID: 32072 - Do Not Display Plan the Member is Chatting About in the Active Chat Window if They Have No Other Plans
 */
export const ActiveChatWindow: React.FC<ActiveChatWindowProps> = ({
  currentPlan,
  hasMultiplePlans,
  children,
}) => {
  return (
    <Card className="active-chat-window">
      <div className="active-chat-container">
        {/* Only show plan information if user has multiple plans */}
        {hasMultiplePlans && currentPlan && (
          <div className="active-chat-plan-info">
            <Row className="active-chat-plan-header">
              <Column>
                <TextBox type="body-2" text="Currently chatting about:" />
                <TextBox type="body-bold" text={currentPlan.name} />
              </Column>
            </Row>
          </div>
        )}

        {/* Chat interface content - will be provided by parent component */}
        <div className="active-chat-content">{children}</div>
      </div>
    </Card>
  );
};
