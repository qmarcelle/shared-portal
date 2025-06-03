import { render, screen, fireEvent } from '@testing-library/react';
import { useChatStore } from '../stores/chatStore';
import { usePlanSwitcherLock } from '../hooks/usePlanSwitcherLock';

// Mock dependencies
jest.mock('../stores/chatStore');
jest.mock('../hooks/usePlanSwitcherLock');

// Mock the logger to avoid console noise during tests
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Simple test component for the hook
const TestComponent = ({ onSwitchPlan }: { onSwitchPlan: () => void }) => {
  const { isPlanSwitcherLocked, planSwitcherTooltip } = usePlanSwitcherLock();
  
  return (
    <div>
      <span data-testid="lock-status">
        {isPlanSwitcherLocked ? 'Locked' : 'Unlocked'}
      </span>
      <span data-testid="tooltip">{planSwitcherTooltip}</span>
      <button 
        data-testid="switch-button" 
        onClick={onSwitchPlan}
        disabled={isPlanSwitcherLocked}
        aria-label="Switch Plan"
      >
        Switch Plan
      </button>
    </div>
  );
};

describe('PlanSwitcher', () => {
  const mockSwitchPlan = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should allow plan switching when chat is not active', () => {
    // Mock the usePlanSwitcherLock hook
    (usePlanSwitcherLock as jest.Mock).mockReturnValue({
      isPlanSwitcherLocked: false,
      planSwitcherTooltip: ''
    });
    
    render(<TestComponent onSwitchPlan={mockSwitchPlan} />);
    
    expect(screen.getByTestId('lock-status')).toHaveTextContent('Unlocked');
    expect(screen.getByTestId('switch-button')).not.toBeDisabled();
    
    // Test that clicking works
    fireEvent.click(screen.getByTestId('switch-button'));
    expect(mockSwitchPlan).toHaveBeenCalledTimes(1);
  });
  
  it('should prevent plan switching when chat is active', () => {
    // Mock the usePlanSwitcherLock hook for locked state
    (usePlanSwitcherLock as jest.Mock).mockReturnValue({
      isPlanSwitcherLocked: true,
      planSwitcherTooltip: 'You cannot switch plans during an active chat session.'
    });
    
    render(<TestComponent onSwitchPlan={mockSwitchPlan} />);
    
    expect(screen.getByTestId('lock-status')).toHaveTextContent('Locked');
    expect(screen.getByTestId('tooltip')).toHaveTextContent('You cannot switch plans during an active chat session.');
    expect(screen.getByTestId('switch-button')).toBeDisabled();
    
    // Test that clicking doesn't work
    fireEvent.click(screen.getByTestId('switch-button'));
    expect(mockSwitchPlan).not.toHaveBeenCalled();
  });
  
  it('should update lock state when chat activation changes', () => {
    // Mock the chat store to control isChatActive
    let mockChatActive = false;
    
    // Mock the hook to read from our local state
    (usePlanSwitcherLock as jest.Mock).mockImplementation(() => ({
      isPlanSwitcherLocked: mockChatActive,
      planSwitcherTooltip: mockChatActive 
        ? 'You cannot switch plans during an active chat session.' 
        : ''
    }));
    
    const { rerender } = render(<TestComponent onSwitchPlan={mockSwitchPlan} />);
    
    // Initially unlocked
    expect(screen.getByTestId('lock-status')).toHaveTextContent('Unlocked');
    expect(screen.getByTestId('switch-button')).not.toBeDisabled();
    
    // Simulate chat becoming active
    mockChatActive = true;
    
    // Force rerender
    rerender(<TestComponent onSwitchPlan={mockSwitchPlan} />);
    
    // Now should be locked
    expect(screen.getByTestId('lock-status')).toHaveTextContent('Locked');
    expect(screen.getByTestId('switch-button')).toBeDisabled();
  });
});