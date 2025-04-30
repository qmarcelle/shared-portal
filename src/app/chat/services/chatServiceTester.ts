/**
 * Chat Service Integration Test
 *
 * This script tests the integration between all chat components, making sure they work together.
 * It can be run from a browser console to validate that the chat system is working as expected.
 */

import {
  destroyChat,
  getGenesysConfig,
  initializeChat,
} from '../config/genesys.config';
import { useChatStore } from '../stores/chatStore';
import { registerErrorHandler } from '../utils/errorHandler';
import { ChatService, loadGenesysScript } from './ChatService';

/**
 * Comprehensive test that verifies the entire chat flow
 */
export async function testChatIntegration(): Promise<void> {
  console.log('Starting chat integration test');

  // 1. Create chat service instance
  const chatService = new ChatService(
    'test-member-id',
    'test-plan-id',
    'Test Plan',
    true,
    (locked) => console.log(`Plan switcher locked: ${locked}`),
  );

  try {
    // 2. Initialize error handler
    registerErrorHandler();
    console.log('Registered error handler');

    // 3. Get chat eligibility from the API
    console.log('Fetching chat eligibility...');
    const chatInfo = await chatService.getChatInfo();
    console.log('Chat eligibility:', chatInfo);

    // 4. Update chat store with eligibility
    const store = useChatStore.getState();
    store.setEligibility({
      isEligible: chatInfo.isEligible,
      chatAvailable: chatInfo.isEligible,
      cloudChatEligible: chatInfo.cloudChatEligible,
      chatGroup: chatInfo.chatGroup,
      workingHours: chatInfo.businessHours?.text,
    });
    console.log('Updated chat store with eligibility');

    // 5. Load the appropriate chat script
    console.log('Loading chat script...');
    const scriptUrl = chatInfo.cloudChatEligible
      ? `https://apps.mypurecloud.com/widgets/9.0/webmessaging.js`
      : '/assets/genesys/click_to_chat.js';
    await loadGenesysScript(scriptUrl);
    console.log('Chat script loaded successfully');

    // 6. Initialize chat with the right configuration
    console.log('Initializing chat...');
    const config = getGenesysConfig({
      memberId: 'test-member-id',
      planId: 'test-plan-id',
      planName: 'Test Plan',
      eligibility: chatInfo,
    });
    await initializeChat(config, chatInfo.cloudChatEligible);
    console.log('Chat initialized successfully');

    // 7. Start a chat session
    console.log('Starting chat session...');
    await chatService.startChat({
      memberId: 'test-member-id',
      planId: 'test-plan-id',
      message: 'Hello, this is a test message',
      timestamp: Date.now(),
    });
    console.log('Chat session started successfully');

    // 8. Send a test message
    console.log('Sending test message...');
    await chatService.sendMessage('This is another test message');
    console.log('Test message sent successfully');

    // Wait 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // 9. End the chat session
    console.log('Ending chat session...');
    await chatService.endChat();
    console.log('Chat session ended successfully');

    // 10. Clean up
    console.log('Cleaning up...');
    destroyChat(chatInfo.cloudChatEligible);
    console.log('Chat destroyed successfully');

    console.log('Chat integration test completed successfully');
  } catch (error) {
    console.error('Chat integration test failed:', error);
    throw error;
  }
}

/**
 * Test cloud path specifically
 */
export async function testCloudChatPath(): Promise<void> {
  console.log('Testing cloud chat path');

  const chatService = new ChatService(
    'cloud-member-id',
    'cloud-plan-id',
    'Cloud Plan',
    false,
    (locked) => console.log(`Plan switcher locked: ${locked}`),
  );

  try {
    // Force cloud eligibility
    useChatStore.getState().setEligibility({
      isEligible: true,
      chatAvailable: true,
      cloudChatEligible: true,
      workingHours: 'Monday - Friday, 9am - 5pm',
    });

    // Load Web Messaging script
    await loadGenesysScript(
      'https://apps.mypurecloud.com/widgets/9.0/webmessaging.js',
    );

    // Initialize with cloud config
    const config = getGenesysConfig({
      memberId: 'cloud-member-id',
      planId: 'cloud-plan-id',
      planName: 'Cloud Plan',
      eligibility: { isEligible: true, cloudChatEligible: true },
    });

    await initializeChat(config, true);

    console.log('Cloud chat path tested successfully');
  } catch (error) {
    console.error('Cloud chat path test failed:', error);
    throw error;
  }
}

/**
 * Test legacy path specifically
 */
export async function testLegacyChatPath(): Promise<void> {
  console.log('Testing legacy chat path');

  const chatService = new ChatService(
    'legacy-member-id',
    'legacy-plan-id',
    'Legacy Plan',
    false,
    (locked) => console.log(`Plan switcher locked: ${locked}`),
  );

  try {
    // Force legacy eligibility
    useChatStore.getState().setEligibility({
      isEligible: true,
      chatAvailable: true,
      cloudChatEligible: false,
      chatGroup: 'default',
      workingHours: 'Monday - Friday, 9am - 5pm',
    });

    // Load legacy script
    await loadGenesysScript('/assets/genesys/click_to_chat.js');

    // Initialize with legacy config
    const config = getGenesysConfig({
      memberId: 'legacy-member-id',
      planId: 'legacy-plan-id',
      planName: 'Legacy Plan',
      eligibility: { isEligible: true, cloudChatEligible: false },
    });

    await initializeChat(config, false);

    console.log('Legacy chat path tested successfully');
  } catch (error) {
    console.error('Legacy chat path test failed:', error);
    throw error;
  }
}

// Make tests available in the window object for browser testing
if (typeof window !== 'undefined') {
  (window as any).__chatTests = {
    testChatIntegration,
    testCloudChatPath,
    testLegacyChatPath,
  };

  console.log('Chat tests are available at window.__chatTests');
}
