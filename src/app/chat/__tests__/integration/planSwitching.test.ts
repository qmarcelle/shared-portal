import { ChatError } from '@/app/chat/types/index';
import { ChatService } from '../../services/ChatService';

describe('Plan Switching Integration Tests', () => {
  let chatService: ChatService;
  const mockLockPlanSwitcher = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    chatService = new ChatService(
      'test-member',
      'test-plan',
      'Test Plan',
      true,
      mockLockPlanSwitcher,
    );
  });

  it('should lock plan switching during active chat', async () => {
    // Mock chat start
    await chatService.startChat({
      PLAN_ID: 'test-plan',
      GROUP_ID: 'test-group',
      LOB: 'Medical',
      lob_group: 'group1',
      IsMedicalEligibile: true,
      IsDentalEligible: false,
      IsVisionEligible: false,
      Origin: 'MemberPortal',
      Source: 'Web',
    });

    // Verify plan switcher was locked
    expect(mockLockPlanSwitcher).toHaveBeenCalledWith(true);
  });

  it('should unlock plan switching when chat ends', async () => {
    // End chat session
    await chatService.endChat();

    // Verify plan switcher was unlocked
    expect(mockLockPlanSwitcher).toHaveBeenCalledWith(false);
  });

  it('should handle errors during chat operations', async () => {
    // Mock fetch to fail
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // Attempt to start chat
    await expect(
      chatService.startChat({
        PLAN_ID: 'test-plan',
        GROUP_ID: 'test-group',
        LOB: 'Medical',
        lob_group: 'group1',
        IsMedicalEligibile: true,
        IsDentalEligible: false,
        IsVisionEligible: false,
        Origin: 'MemberPortal',
        Source: 'Web',
      }),
    ).rejects.toThrow(ChatError);

    // Verify plan switcher state wasn't changed
    expect(mockLockPlanSwitcher).not.toHaveBeenCalled();
  });
});
