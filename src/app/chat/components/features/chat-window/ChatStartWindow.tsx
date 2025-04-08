'use client';

import { Button } from '@/components/foundation/Button';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import React, { useState } from 'react';
import { ChatPlan } from '../../../types/types';

interface ChatStartWindowProps {
  onStartChat: () => void;
  onCloseChatWindow: () => void;
  onSwitchPlan: () => void;
  currentPlan: ChatPlan | null;
  hasMultiplePlans: boolean;
}

/**
 * ChatStartWindow Component
 * Displays plan information before starting chat
 *
 * @userStory ID: 31161 - Display Plan Member Will Chat About in Start Chat Window
 * @userStory ID: 31164 - Display Option to Switch Plan in Chat Start Window
 * @userStory ID: 31166 - Do Not Display Current Plan or the Option to Switch Plans in the Chat Start Window if Members has no Other Plans
 */
export const ChatStartWindow: React.FC<ChatStartWindowProps> = ({
  onStartChat,
  onCloseChatWindow,
  onSwitchPlan,
  currentPlan,
  hasMultiplePlans,
}) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  if (!currentPlan) {
    return (
      <Card className="chat-start-window">
        <div className="chat-start-error">
          <p>No plan selected. Please select a plan to continue.</p>
          <Button type="primary" callback={onCloseChatWindow} label="Close" />
        </div>
      </Card>
    );
  }

  const handleStartChat = () => {
    if (acceptedTerms) {
      onStartChat();
    }
  };

  return (
    <Card className="chat-start-window">
      <Column className="chat-start-content">
        <Header type="title-3" text="Chat with Customer Service" />

        {/* Only show plan information if user has multiple plans */}
        {hasMultiplePlans && (
          <div className="chat-plan-info">
            <Row className="chat-plan-header">
              <TextBox type="body-bold" text="Chat about this plan:" />
            </Row>
            <Row className="chat-plan-details">
              <Column>
                <TextBox text={currentPlan.name} />
                <TextBox text={`ID: ${currentPlan.memberId}`} />
                <TextBox text={`Type: ${currentPlan.lineOfBusiness}`} />
              </Column>

              <Button
                type="ghost"
                callback={onSwitchPlan}
                label="Switch"
                className="chat-switch-button"
                ariaLabel="Switch to a different plan"
              />
            </Row>
          </div>
        )}

        <div className="chat-terms-container">
          <label className="chat-terms-label">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="chat-terms-checkbox"
            />
            <span>
              I accept the terms and conditions for using chat services
            </span>
          </label>
        </div>

        <div className="chat-start-actions">
          <Button
            type="secondary"
            callback={onCloseChatWindow}
            label="Cancel"
          />
          <Button
            type="primary"
            callback={handleStartChat}
            label="Start Chat"
            disabled={!acceptedTerms}
          />
        </div>
      </Column>
    </Card>
  );
};
