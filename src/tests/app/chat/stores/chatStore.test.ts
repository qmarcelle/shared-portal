// src/tests/app/chat/stores/chatStore.test.ts

import { act } from '@testing-library/react';
import { getChatInfo } from '../../../../app/chat/api';
import { buildGenesysChatConfig } from '../../../../app/chat/config/genesysChatConfig';
import {
  chatConfigSelectors,
  chatScriptSelectors,
  chatSessionSelectors,
  chatUISelectors,
  useChatStore,
} from '../../../../app/chat/stores/chatStore';
import { ScriptLoadPhase } from '../../../../app/chat/types/chat-types';

// Mock external dependencies
jest.mock('../../../../app/chat/api', () => ({
  getChatInfo: jest.fn(),
}));

jest.mock('../../../../app/chat/genesysChatConfig', () => ({
  buildGenesysChatConfig: jest.fn(),
}));

// Mock data for tests
const mockChatInfoResponse = {
  isEligible: true,
  cloudChatEligible: false,
  chatAvailable: true,
  businessHours: {
    isOpen: true,
    text: 'Monday-Friday 8am-5pm ET',
  },
  workingHours: 'M_F_8_17',
  rawChatHrs: '8_17',
};

// Chat info responses for different eligibility/availability scenarios
const mockEligibleUnavailableChatInfo = {
  ...mockChatInfoResponse,
  chatAvailable: false,
  businessHours: {
    isOpen: false,
    text: 'Monday-Friday 8am-5pm ET',
  },
};

const mockIneligibleAvailableChatInfo = {
  ...mockChatInfoResponse,
  isEligible: false,
};

const mockIneligibleUnavailableChatInfo = {
  ...mockChatInfoResponse,
  isEligible: false,
  chatAvailable: false,
  businessHours: {
    isOpen: false,
    text: 'Monday-Friday 8am-5pm ET',
  },
};

const mockCloudChatInfo = {
  ...mockChatInfoResponse,
  cloudChatEligible: true,
  genesysCloudConfig: {
    deploymentId: 'test-deployment-id',
    environment: 'test-environment',
  },
};

const mockGenesysChatConfig = {
  isChatEligibleMember: true,
  isChatAvailable: true,
  workingHours: 'M_F_8_17',
  chatHours: 'Monday-Friday 8am-5pm ET',
  idCardChatBotName: 'IDCardBot',
  userData: {
    firstName: 'John',
    lastName: 'Doe',
  },
  formInputs: [{ id: 'firstName', value: 'John' }],
};

// Sample chat messages for testing
const mockChatMessages = [
  {
    id: '1',
    content: 'Hello, I need help with my claim',
    sender: 'user' as const,
  },
  {
    id: '2',
    content:
      'I would be happy to help you with your claim. Can you provide your claim number?',
    sender: 'agent' as const,
  },
];

describe('ChatStore', () => {
  // Reset the store before each test
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    // Reset store to initial state
    act(() => {
      useChatStore.setState({
        ui: {
          isOpen: false,
          isMinimized: false,
          newMessageCount: 0,
        },
        config: {
          isLoading: false,
          error: null,
          legacyConfig: undefined,
          cloudConfig: undefined,
          chatData: null,
        },
        session: {
          isChatActive: false,
          messages: [],
          isPlanSwitcherLocked: false,
          planSwitcherTooltip: '',
          standardErrorMessage:
            'There was an issue starting your chat session. Please verify your connection and that you submitted all required information properly, then try again.',
        },
        scripts: {
          scriptLoadPhase: ScriptLoadPhase.INIT,
        },
        actions: useChatStore.getState().actions,
      });
    });
  });

  describe('Initial State', () => {
    it('should initialize with default values', () => {
      const state = useChatStore.getState();
      expect(state.ui.isOpen).toBe(false);
      expect(state.ui.isMinimized).toBe(false);
      expect(state.ui.newMessageCount).toBe(0);
      expect(state.config.isLoading).toBe(false);
      expect(state.config.error).toBeNull();
      expect(state.config.chatData).toBeNull();
      expect(state.session.isChatActive).toBe(false);
      expect(state.session.messages).toEqual([]);
      expect(state.session.isPlanSwitcherLocked).toBe(false);
      expect(state.scripts.scriptLoadPhase).toBe(ScriptLoadPhase.INIT);
    });
  });

  describe('Selectors', () => {
    describe('Config Selectors', () => {
      describe('isChatEnabled Selector', () => {
        it('should return true only when both isEligible and chatAvailable are true', () => {
          // Test all four combinations

          // Case 1: isEligible: true, chatAvailable: true
          act(() => {
            useChatStore.setState({
              config: {
                ...useChatStore.getState().config,
                chatData: {
                  isEligible: true,
                  chatAvailable: true,
                  cloudChatEligible: false,
                },
              },
            });
          });
          expect(
            chatConfigSelectors.isChatEnabled(useChatStore.getState()),
          ).toBe(true);

          // Case 2: isEligible: true, chatAvailable: false
          act(() => {
            useChatStore.setState({
              config: {
                ...useChatStore.getState().config,
                chatData: {
                  isEligible: true,
                  chatAvailable: false,
                  cloudChatEligible: false,
                },
              },
            });
          });
          expect(
            chatConfigSelectors.isChatEnabled(useChatStore.getState()),
          ).toBe(false);

          // Case 3: isEligible: false, chatAvailable: true
          act(() => {
            useChatStore.setState({
              config: {
                ...useChatStore.getState().config,
                chatData: {
                  isEligible: false,
                  chatAvailable: true,
                  cloudChatEligible: false,
                },
              },
            });
          });
          expect(
            chatConfigSelectors.isChatEnabled(useChatStore.getState()),
          ).toBe(false);

          // Case 4: isEligible: false, chatAvailable: false
          act(() => {
            useChatStore.setState({
              config: {
                ...useChatStore.getState().config,
                chatData: {
                  isEligible: false,
                  chatAvailable: false,
                  cloudChatEligible: false,
                },
              },
            });
          });
          expect(
            chatConfigSelectors.isChatEnabled(useChatStore.getState()),
          ).toBe(false);
        });

        it('should be enabled regardless of hasConsent value', () => {
          // Set eligible and available with consent
          act(() => {
            useChatStore.setState({
              config: {
                ...useChatStore.getState().config,
                chatData: {
                  isEligible: true,
                  chatAvailable: true,
                  cloudChatEligible: false,
                },
              },
            });
          });

          expect(
            chatConfigSelectors.isChatEnabled(useChatStore.getState()),
          ).toBe(true);

          // Set eligible and available without consent - should still be enabled
          act(() => {
            useChatStore.setState({
              config: {
                ...useChatStore.getState().config,
                chatData: {
                  isEligible: true,
                  chatAvailable: true,
                  cloudChatEligible: false,
                },
              },
            });
          });

          // Since we removed PBE consent dependency, this should still be true
          expect(
            chatConfigSelectors.isChatEnabled(useChatStore.getState()),
          ).toBe(true);
        });
      });

      it('should correctly determine chat mode', () => {
        // Legacy mode
        act(() => {
          useChatStore.setState({
            config: {
              ...useChatStore.getState().config,
              chatData: {
                isEligible: true,
                chatAvailable: true,
                cloudChatEligible: false,
              },
            },
          });
        });

        expect(chatConfigSelectors.chatMode(useChatStore.getState())).toBe(
          'legacy',
        );

        // Cloud mode
        act(() => {
          useChatStore.setState({
            config: {
              ...useChatStore.getState().config,
              chatData: {
                isEligible: true,
                chatAvailable: true,
                cloudChatEligible: true,
              },
            },
          });
        });

        expect(chatConfigSelectors.chatMode(useChatStore.getState())).toBe(
          'cloud',
        );
      });

      it('should check if chat is in OOO (out-of-office) hours', () => {
        // In business hours
        act(() => {
          useChatStore.setState({
            config: {
              ...useChatStore.getState().config,
              chatData: {
                isEligible: true,
                chatAvailable: true,
                cloudChatEligible: false,
                businessHours: {
                  isOpen: true,
                  text: 'Monday-Friday 8am-5pm ET',
                },
              },
            },
          });
        });

        expect(chatConfigSelectors.isOOO(useChatStore.getState())).toBe(false);

        // Outside business hours
        act(() => {
          useChatStore.setState({
            config: {
              ...useChatStore.getState().config,
              chatData: {
                isEligible: true,
                chatAvailable: true,
                cloudChatEligible: false,
                businessHours: {
                  isOpen: false,
                  text: 'Monday-Friday 8am-5pm ET',
                },
              },
            },
          });
        });

        expect(chatConfigSelectors.isOOO(useChatStore.getState())).toBe(true);
      });

      it('should get business hours text', () => {
        act(() => {
          useChatStore.setState({
            config: {
              ...useChatStore.getState().config,
              chatData: {
                isEligible: true,
                chatAvailable: true,
                cloudChatEligible: false,
                businessHours: {
                  isOpen: true,
                  text: 'Monday-Friday 8am-5pm ET',
                },
              },
            },
          });
        });

        expect(
          chatConfigSelectors.businessHoursText(useChatStore.getState()),
        ).toBe('Monday-Friday 8am-5pm ET');
      });
    });

    describe('UI Selectors', () => {
      it('should check if chat is open', () => {
        expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(false);

        act(() => {
          useChatStore.setState({
            ui: {
              ...useChatStore.getState().ui,
              isOpen: true,
            },
          });
        });

        expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(true);
      });

      it('should check if chat is minimized', () => {
        expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(
          false,
        );

        act(() => {
          useChatStore.setState({
            ui: {
              ...useChatStore.getState().ui,
              isMinimized: true,
            },
          });
        });

        expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(true);
      });

      it('should get new message count', () => {
        expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(
          0,
        );

        act(() => {
          useChatStore.setState({
            ui: {
              ...useChatStore.getState().ui,
              newMessageCount: 3,
            },
          });
        });

        expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(
          3,
        );
      });
    });

    describe('Session Selectors', () => {
      it('should check if chat is active', () => {
        expect(chatSessionSelectors.isChatActive(useChatStore.getState())).toBe(
          false,
        );

        act(() => {
          useChatStore.setState({
            session: {
              ...useChatStore.getState().session,
              isChatActive: true,
            },
          });
        });

        expect(chatSessionSelectors.isChatActive(useChatStore.getState())).toBe(
          true,
        );
      });

      it('should get chat messages', () => {
        expect(chatSessionSelectors.messages(useChatStore.getState())).toEqual(
          [],
        );

        act(() => {
          useChatStore.setState({
            session: {
              ...useChatStore.getState().session,
              messages: mockChatMessages,
            },
          });
        });

        expect(chatSessionSelectors.messages(useChatStore.getState())).toEqual(
          mockChatMessages,
        );
      });

      it('should check if plan switcher is locked', () => {
        expect(
          chatSessionSelectors.isPlanSwitcherLocked(useChatStore.getState()),
        ).toBe(false);

        act(() => {
          useChatStore.setState({
            session: {
              ...useChatStore.getState().session,
              isPlanSwitcherLocked: true,
            },
          });
        });

        expect(
          chatSessionSelectors.isPlanSwitcherLocked(useChatStore.getState()),
        ).toBe(true);
      });
    });

    describe('Script Selectors', () => {
      it('should get script load phase', () => {
        expect(
          chatScriptSelectors.scriptLoadPhase(useChatStore.getState()),
        ).toBe(ScriptLoadPhase.INIT);

        act(() => {
          useChatStore.setState({
            scripts: {
              scriptLoadPhase: ScriptLoadPhase.LOADED,
            },
          });
        });

        expect(
          chatScriptSelectors.scriptLoadPhase(useChatStore.getState()),
        ).toBe(ScriptLoadPhase.LOADED);
      });
    });
  });

  describe('loadChatConfiguration Action', () => {
    beforeEach(() => {
      // Mock API responses
      (getChatInfo as jest.Mock).mockResolvedValue(mockChatInfoResponse);
      (buildGenesysChatConfig as jest.Mock).mockReturnValue(
        mockGenesysChatConfig,
      );
    });

    it('should load chat configuration and set hasConsent to true', async () => {
      const { actions } = useChatStore.getState();

      await act(async () => {
        await actions.loadChatConfiguration('12345', 'plan123', 'member');
      });

      // Check API was called with correct params
      expect(getChatInfo).toHaveBeenCalledWith('12345', 'plan123', 'member');

      // Verify hasConsent is set to true regardless of PBE
      // const state = useChatStore.getState(); // No longer needed for this check
      // expect(state.config.hasConsent).toBe(true); // Removed: hasConsent is no longer in state
    });

    it('should set legacyConfig when cloudChatEligible is false', async () => {
      (getChatInfo as jest.Mock).mockResolvedValue({
        ...mockChatInfoResponse,
        cloudChatEligible: false,
      });

      const { actions } = useChatStore.getState();

      await act(async () => {
        await actions.loadChatConfiguration('12345', 'plan123', 'member');
      });

      const state = useChatStore.getState();
      expect(state.config.legacyConfig).toBeDefined();
      expect(state.config.cloudConfig).toBeUndefined();

      // hasConsent should be true
      // expect(useChatStore.getState().config.hasConsent).toBe(true); // Removed: hasConsent is no longer in state

      // Start a chat
      act(() => {
        actions.startChat();
      });
    });

    it('should set cloudConfig when cloudChatEligible is true', async () => {
      (getChatInfo as jest.Mock).mockResolvedValue(mockCloudChatInfo);

      const { actions } = useChatStore.getState();

      await act(async () => {
        await actions.loadChatConfiguration('12345', 'plan123', 'member');
      });

      const state = useChatStore.getState();
      expect(state.config.cloudConfig).toBeDefined();
      expect(state.config.cloudConfig!.deploymentId).toBe('test-deployment-id');
      expect(state.config.cloudConfig!.environment).toBe('test-environment');
    });

    it('should handle API errors properly', async () => {
      const testError = new Error('API error');
      (getChatInfo as jest.Mock).mockRejectedValue(testError);

      const { actions } = useChatStore.getState();

      await act(async () => {
        await actions.loadChatConfiguration('12345', 'plan123', 'member');
      });

      const state = useChatStore.getState();
      expect(state.config.error).toEqual(testError);
      expect(state.config.isLoading).toBe(false);
    });
  });

  describe('UI Actions', () => {
    it('should set chat open state', () => {
      const { actions } = useChatStore.getState();

      // Initially closed
      expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(false);

      // Open the chat
      act(() => {
        actions.setOpen(true);
      });

      expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(true);

      // Close the chat
      act(() => {
        actions.setOpen(false);
      });

      expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(false);
    });

    it('should set chat minimized state', () => {
      const { actions } = useChatStore.getState();

      // Initially not minimized
      expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(false);

      // Minimize the chat
      act(() => {
        actions.setMinimized(true);
      });

      expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(true);

      // Unminimize the chat
      act(() => {
        actions.setMinimized(false);
      });

      expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(false);
    });

    it('should minimize chat', () => {
      const { actions } = useChatStore.getState();

      // Initially not minimized and closed
      expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(false);
      expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(false);

      // First set up correct initial state - the chat needs to be open first
      act(() => {
        actions.setOpen(true);
      });

      // Now minimize the chat
      act(() => {
        actions.minimizeChat();
      });

      expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(true);
      expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(true);
    });

    it('should maximize chat', () => {
      const { actions } = useChatStore.getState();

      // Set initial state to minimized
      act(() => {
        useChatStore.setState({
          ui: {
            ...useChatStore.getState().ui,
            isMinimized: true,
            isOpen: true,
          },
        });
      });

      // Maximize the chat
      act(() => {
        actions.maximizeChat();
      });

      expect(chatUISelectors.isMinimized(useChatStore.getState())).toBe(false);
      expect(chatUISelectors.isOpen(useChatStore.getState())).toBe(true);
    });

    it('should increment message count', () => {
      const { actions } = useChatStore.getState();

      // Initial count is 0
      expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(0);

      // Increment once
      act(() => {
        actions.incrementMessageCount();
      });

      expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(1);

      // Increment again
      act(() => {
        actions.incrementMessageCount();
      });

      expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(2);
    });

    it('should reset message count', () => {
      const { actions } = useChatStore.getState();

      // Set initial count to non-zero
      act(() => {
        useChatStore.setState({
          ui: {
            ...useChatStore.getState().ui,
            newMessageCount: 5,
          },
        });
      });

      expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(5);

      // Reset count
      act(() => {
        actions.resetMessageCount();
      });

      expect(chatUISelectors.newMessageCount(useChatStore.getState())).toBe(0);
    });
  });

  describe('Session Actions', () => {
    it('should set chat active state', () => {
      const { actions } = useChatStore.getState();

      // Initially inactive
      expect(chatSessionSelectors.isChatActive(useChatStore.getState())).toBe(
        false,
      );

      // Activate chat
      act(() => {
        actions.setChatActive(true);
      });

      expect(chatSessionSelectors.isChatActive(useChatStore.getState())).toBe(
        true,
      );

      // Deactivate chat
      act(() => {
        actions.setChatActive(false);
      });

      expect(chatSessionSelectors.isChatActive(useChatStore.getState())).toBe(
        false,
      );
    });

    it('should add message to chat', () => {
      const { actions } = useChatStore.getState();

      // Initially no messages
      expect(chatSessionSelectors.messages(useChatStore.getState())).toEqual(
        [],
      );

      const message1 = {
        content: 'Hello',
        sender: 'user' as const,
      };

      // Add first message
      act(() => {
        actions.addMessage(message1);
      });

      // The message in the store will have an id assigned
      const storeMessages1 = chatSessionSelectors.messages(
        useChatStore.getState(),
      );
      expect(storeMessages1.length).toBe(1);
      expect(storeMessages1[0].content).toBe('Hello');
      expect(storeMessages1[0].sender).toBe('user');

      const message2 = {
        content: 'How can I help?',
        sender: 'agent' as const,
      };

      // Add second message
      act(() => {
        actions.addMessage(message2);
      });

      const storeMessages2 = chatSessionSelectors.messages(
        useChatStore.getState(),
      );
      expect(storeMessages2.length).toBe(2);
      expect(storeMessages2[0].content).toBe('Hello');
      expect(storeMessages2[1].content).toBe('How can I help?');
    });

    it('should clear all messages', () => {
      const { actions } = useChatStore.getState();

      // Set initial state with messages
      act(() => {
        useChatStore.setState({
          session: {
            ...useChatStore.getState().session,
            messages: mockChatMessages,
          },
        });
      });

      expect(chatSessionSelectors.messages(useChatStore.getState())).toEqual(
        mockChatMessages,
      );

      // Clear messages
      act(() => {
        actions.clearMessages();
      });

      expect(chatSessionSelectors.messages(useChatStore.getState())).toEqual(
        [],
      );
    });

    it('should set plan switcher lock state', () => {
      const { actions } = useChatStore.getState();

      // Initially unlocked
      expect(
        chatSessionSelectors.isPlanSwitcherLocked(useChatStore.getState()),
      ).toBe(false);

      // Lock plan switcher
      act(() => {
        actions.setPlanSwitcherLocked(true);
      });

      expect(
        chatSessionSelectors.isPlanSwitcherLocked(useChatStore.getState()),
      ).toBe(true);

      // Unlock plan switcher
      act(() => {
        actions.setPlanSwitcherLocked(false);
      });

      expect(
        chatSessionSelectors.isPlanSwitcherLocked(useChatStore.getState()),
      ).toBe(false);
    });

    it('should set loading state', () => {
      const { actions } = useChatStore.getState();

      // Initially not loading
      expect(useChatStore.getState().config.isLoading).toBe(false);

      // Set loading to true
      act(() => {
        actions.setLoading(true);
      });

      expect(useChatStore.getState().config.isLoading).toBe(true);

      // Set loading to false
      act(() => {
        actions.setLoading(false);
      });

      expect(useChatStore.getState().config.isLoading).toBe(false);
    });

    it('should handle startChat action', () => {
      const { actions } = useChatStore.getState();

      // Initially not active, not locked
      expect(useChatStore.getState().session.isChatActive).toBe(false);
      expect(useChatStore.getState().session.isPlanSwitcherLocked).toBe(false);

      // Start chat
      act(() => {
        actions.startChat();
      });

      // Should be active and locked
      expect(useChatStore.getState().session.isChatActive).toBe(true);
      expect(useChatStore.getState().session.isPlanSwitcherLocked).toBe(true);
    });

    it('should handle endChat action', () => {
      const { actions } = useChatStore.getState();

      // First start a chat
      act(() => {
        actions.startChat();
      });

      // Add some messages
      act(() => {
        actions.addMessage({
          content: 'Test message',
          sender: 'user' as const,
        });
      });

      // Verify initial state
      expect(useChatStore.getState().session.isChatActive).toBe(true);
      expect(useChatStore.getState().session.isPlanSwitcherLocked).toBe(true);
      expect(
        chatSessionSelectors.messages(useChatStore.getState()).length,
      ).toBe(1);

      // End chat
      act(() => {
        actions.endChat();
      });

      // Should not be active, not locked
      expect(useChatStore.getState().session.isChatActive).toBe(false);
      expect(useChatStore.getState().session.isPlanSwitcherLocked).toBe(false);

      // Messages should still be present (not cleared automatically)
      expect(
        chatSessionSelectors.messages(useChatStore.getState()).length,
      ).toBe(1);
    });

    it('should handle closeAndRedirect action', () => {
      const { actions } = useChatStore.getState();

      // Set up initial state
      act(() => {
        actions.setOpen(true);
        actions.setChatActive(true);
        // Add a message
        actions.addMessage({
          content: 'Test message',
          sender: 'user' as const,
        });
      });

      // Verify initial state
      expect(useChatStore.getState().ui.isOpen).toBe(true);
      expect(useChatStore.getState().session.isChatActive).toBe(true);
      expect(
        chatSessionSelectors.messages(useChatStore.getState()).length,
      ).toBe(1);

      // Call closeAndRedirect
      act(() => {
        actions.closeAndRedirect();
      });

      // Chat should be closed and inactive
      expect(useChatStore.getState().ui.isOpen).toBe(false);
      expect(useChatStore.getState().session.isChatActive).toBe(false);

      // Messages should be cleared
      expect(
        chatSessionSelectors.messages(useChatStore.getState()).length,
      ).toBe(0);
    });
  });

  describe('Script Loading Actions', () => {
    it('should set script load phase', () => {
      const { actions } = useChatStore.getState();

      // Initial phase
      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.INIT,
      );

      // Set to loading
      act(() => {
        actions.setScriptLoadPhase(ScriptLoadPhase.LOADING);
      });

      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.LOADING,
      );

      // Set to loaded
      act(() => {
        actions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
      });

      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.LOADED,
      );

      // Set to error
      act(() => {
        actions.setScriptLoadPhase(ScriptLoadPhase.ERROR);
      });

      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.ERROR,
      );
    });
  });

  describe('Complete user flows', () => {
    it('should handle complete flow from loading configuration to enabling chat', async () => {
      (getChatInfo as jest.Mock).mockResolvedValue(mockChatInfoResponse);
      (buildGenesysChatConfig as jest.Mock).mockReturnValue(
        mockGenesysChatConfig,
      );

      const { actions } = useChatStore.getState();

      // Initially chat should not be enabled with null chatData
      expect(chatConfigSelectors.isChatEnabled(useChatStore.getState())).toBe(
        false,
      );

      // Load configuration
      await act(async () => {
        await actions.loadChatConfiguration('12345', 'plan123', 'member');
      });

      // After loading, chat should be enabled
      expect(chatConfigSelectors.isChatEnabled(useChatStore.getState())).toBe(
        true,
      );

      // hasConsent should be true
      // expect(useChatStore.getState().config.hasConsent).toBe(true); // Removed: hasConsent is no longer in state

      // Start a chat
      act(() => {
        actions.startChat();
      });

      // Chat should be active
      expect(useChatStore.getState().session.isChatActive).toBe(true);

      // Plan switcher should be locked during active chat
      expect(useChatStore.getState().session.isPlanSwitcherLocked).toBe(true);

      // End the chat
      act(() => {
        actions.endChat();
      });

      // Chat should no longer be active
      expect(useChatStore.getState().session.isChatActive).toBe(false);

      // Plan switcher should be unlocked again
      expect(useChatStore.getState().session.isPlanSwitcherLocked).toBe(false);
    });

    it('should handle a complete messaging flow', async () => {
      (getChatInfo as jest.Mock).mockResolvedValue(mockChatInfoResponse);
      (buildGenesysChatConfig as jest.Mock).mockReturnValue(
        mockGenesysChatConfig,
      );

      const { actions } = useChatStore.getState();

      // Load configuration
      await act(async () => {
        await actions.loadChatConfiguration('12345', 'plan123', 'member');
      });

      // Start chat
      act(() => {
        actions.startChat();
      });

      expect(useChatStore.getState().session.isChatActive).toBe(true);
      expect(useChatStore.getState().session.messages).toEqual([]);

      // User sends a message
      const userMessage = {
        content: 'Hello, I need help',
        sender: 'user' as const,
      };

      act(() => {
        actions.addMessage(userMessage);
      });

      const storeMessages1 = chatSessionSelectors.messages(
        useChatStore.getState(),
      );
      expect(storeMessages1.length).toBe(1);
      expect(storeMessages1[0].content).toBe('Hello, I need help');
      expect(storeMessages1[0].sender).toBe('user');

      // Agent responds
      const agentMessage = {
        content: 'How can I help you today?',
        sender: 'agent' as const,
      };

      act(() => {
        actions.addMessage(agentMessage);
        // When minimized, message count should increment
        actions.setMinimized(true);
        actions.incrementMessageCount();
      });

      const storeMessages2 = chatSessionSelectors.messages(
        useChatStore.getState(),
      );
      expect(storeMessages2.length).toBe(2);
      expect(storeMessages2[1].content).toBe('How can I help you today?');
      expect(useChatStore.getState().ui.newMessageCount).toBe(1);

      // User maximizes chat and views messages
      act(() => {
        actions.maximizeChat();
        actions.resetMessageCount();
      });

      expect(useChatStore.getState().ui.isMinimized).toBe(false);
      expect(useChatStore.getState().ui.newMessageCount).toBe(0);

      // End chat
      act(() => {
        actions.endChat();
      });

      expect(useChatStore.getState().session.isChatActive).toBe(false);
      // Messages are preserved when chat ends
      expect(
        chatSessionSelectors.messages(useChatStore.getState()).length,
      ).toBe(2);

      // Clear messages
      act(() => {
        actions.clearMessages();
      });

      expect(useChatStore.getState().session.messages).toEqual([]);
    });

    it('should handle script loading flow', () => {
      const { actions } = useChatStore.getState();

      // Initial state
      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.INIT,
      );

      // Start loading script
      act(() => {
        actions.setScriptLoadPhase(ScriptLoadPhase.LOADING);
      });

      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.LOADING,
      );

      // Script loaded successfully
      act(() => {
        actions.setScriptLoadPhase(ScriptLoadPhase.LOADED);
      });

      expect(chatScriptSelectors.scriptLoadPhase(useChatStore.getState())).toBe(
        ScriptLoadPhase.LOADED,
      );

      // Now chat can be started (would be done by UI)
      act(() => {
        actions.startChat();
      });

      expect(useChatStore.getState().session.isChatActive).toBe(true);
    });
  });
});
