import React, { RefObject } from 'react';
import { createWebMessagingConfig } from '../../config';
import { ChatError } from '../../types/errors';
import type { ChatPlan, GenesysUserData } from '../../types/types';

interface CloudChatWidgetProps {
  containerRef: RefObject<HTMLDivElement>;
  currentPlan: ChatPlan;
  onLockPlanSwitcher: () => void;
  onError: (error: ChatError) => void;
}

export const CloudChatWidget: React.FC<CloudChatWidgetProps> = ({
  containerRef,
  currentPlan,
  onLockPlanSwitcher,
  onError,
}) => {
  // Initialize Genesys Cloud chat
  React.useEffect(() => {
    if (!containerRef.current) {
      onError(
        new ChatError('Chat container not found', 'INITIALIZATION_ERROR'),
      );
      return;
    }

    try {
      const userData: Partial<GenesysUserData> = {
        config: {
          deploymentId: process.env.NEXT_PUBLIC_GENESYS_DEPLOYMENT_ID || '',
          region: process.env.NEXT_PUBLIC_GENESYS_REGION || '',
          planId: currentPlan.id,
        },
        userInfo: {
          firstName: currentPlan.memberFirstname || '',
          lastName: currentPlan.memberLastname || '',
          customFields: {
            planId: currentPlan.id,
            groupId: currentPlan.groupId,
            lob: currentPlan.lineOfBusiness,
            lobGroup: currentPlan.lobGroup || '',
          },
        },
      };

      // Initialize Genesys Cloud chat with config
      const genesys = window._genesys?.widgets?.webchat;
      if (!genesys) {
        throw new Error('Genesys Cloud chat not available');
      }

      // Lock plan switcher while chat is active
      onLockPlanSwitcher();

      // Create widget config
      createWebMessagingConfig(containerRef.current, userData);

      // Initialize chat
      genesys
        .ready()
        .then(() => genesys.startChat())
        .catch((error) => {
          onError(new ChatError(error.message, 'INITIALIZATION_ERROR'));
        });

      return () => {
        // Cleanup if needed
        try {
          genesys.endChat().catch(console.error);
        } catch (error) {
          console.error('Error cleaning up chat widget:', error);
        }
      };
    } catch (error) {
      onError(
        new ChatError(
          error instanceof Error ? error.message : 'Failed to initialize chat',
          'INITIALIZATION_ERROR',
        ),
      );
    }
  }, [containerRef, currentPlan, onLockPlanSwitcher, onError]);

  return null; // Genesys Cloud chat renders itself in the container
};
