import { ChatError } from '../../models/errors';
import { ChatService } from '../../services/ChatService';
import { LegacyPlanSwitchService } from '../../services/LegacyPlanSwitchService';
import { mockBusinessHours, mockChatPlan } from '../mocks/chatData';

describe('Plan Switching Integration Tests', () => {
  let chatService: ChatService;
  let planSwitchService: LegacyPlanSwitchService;

  beforeEach(() => {
    // Initialize services with test configuration
    chatService = new ChatService({
      token: 'test-token',
      endPoint: '/api/chat',
      opsPhone: '1-800-TEST',
      userID: 'test-user',
      memberFirstname: 'Test',
      memberLastname: 'User',
      memberId: 'test-member',
      groupId: 'test-group',
      planId: 'test-plan',
      planName: 'Test Plan',
      businessHours: mockBusinessHours,
    });

    planSwitchService = new LegacyPlanSwitchService(chatService);
  });

  it('should successfully switch plans when chat is not active', async () => {
    const newPlan = {
      ...mockChatPlan,
      id: 'new-plan-id',
      name: 'New Test Plan',
    };

    await expect(
      planSwitchService.handlePlanSwitch(newPlan),
    ).resolves.not.toThrow();

    const currentSession = await chatService.getCurrentSession();
    expect(currentSession?.planId).toBe(newPlan.id);
    expect(currentSession?.planName).toBe(newPlan.name);
  });

  it('should maintain session preferences after plan switch', async () => {
    // Set up initial session with preferences
    await chatService.initialize({
      token: 'test-token',
      endPoint: '/api/chat',
      opsPhone: '1-800-TEST',
      userID: 'test-user',
      memberFirstname: 'Test',
      memberLastname: 'User',
      memberId: 'test-member',
      groupId: 'test-group',
      planId: 'test-plan',
      planName: 'Test Plan',
      businessHours: mockBusinessHours,
    });

    await chatService.updatePreferences({
      notifications: true,
      theme: 'dark',
      fontSize: 'large',
    });

    const newPlan = {
      ...mockChatPlan,
      id: 'new-plan-id',
      name: 'New Test Plan',
    };

    await planSwitchService.handlePlanSwitch(newPlan);

    const currentSession = await chatService.getCurrentSession();
    expect(currentSession?.preferences).toEqual({
      notifications: true,
      theme: 'dark',
      fontSize: 'large',
    });
  });

  it('should handle errors during plan switch and restore previous session', async () => {
    // Mock a failed JWT refresh
    jest
      .spyOn(chatService, 'refreshToken')
      .mockRejectedValueOnce(
        new ChatError('Token refresh failed', 'auth_error', 'error'),
      );

    const originalPlan = mockChatPlan;
    const newPlan = {
      ...mockChatPlan,
      id: 'new-plan-id',
      name: 'New Test Plan',
    };

    await expect(planSwitchService.handlePlanSwitch(newPlan)).rejects.toThrow(
      ChatError,
    );

    const currentSession = await chatService.getCurrentSession();
    expect(currentSession?.planId).toBe(originalPlan.id);
    expect(currentSession?.planName).toBe(originalPlan.name);
  });

  it('should retry failed plan switches up to maximum attempts', async () => {
    const failedAttempts = jest.fn();

    // Mock consecutive failures
    jest
      .spyOn(chatService, 'refreshToken')
      .mockRejectedValue(
        new ChatError('Token refresh failed', 'auth_error', 'error'),
      );

    const newPlan = {
      ...mockChatPlan,
      id: 'new-plan-id',
      name: 'New Test Plan',
    };

    try {
      await planSwitchService.handlePlanSwitch(newPlan);
    } catch (error) {
      failedAttempts();
    }

    expect(failedAttempts).toHaveBeenCalledTimes(1);
    expect(chatService.refreshToken).toHaveBeenCalledTimes(3); // MAX_RETRY_ATTEMPTS
  });

  it('should handle concurrent plan switches gracefully', async () => {
    const newPlan1 = {
      ...mockChatPlan,
      id: 'new-plan-1',
      name: 'New Plan 1',
    };

    const newPlan2 = {
      ...mockChatPlan,
      id: 'new-plan-2',
      name: 'New Plan 2',
    };

    // Attempt to switch plans concurrently
    const switch1 = planSwitchService.handlePlanSwitch(newPlan1);
    const switch2 = planSwitchService.handlePlanSwitch(newPlan2);

    await expect(Promise.all([switch1, switch2])).rejects.toThrow(ChatError);

    const currentSession = await chatService.getCurrentSession();
    // Only one switch should succeed
    expect([newPlan1.id, newPlan2.id]).toContain(currentSession?.planId);
  });
});
