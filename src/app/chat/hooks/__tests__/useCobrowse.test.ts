import { act, renderHook } from '@testing-library/react';
import { CobrowseService } from '../../services/CobrowseService';
import { useCobrowse } from '../useCobrowse';

// Mock the CobrowseService
const mockCobrowseService = {
  initialize: jest.fn(),
  createSession: jest.fn(),
  endSession: jest.fn(),
};

describe('useCobrowse', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockCobrowseService.initialize as jest.Mock).mockResolvedValue(undefined);
    (mockCobrowseService.createSession as jest.Mock).mockResolvedValue(
      'test-session-code',
    );
    (mockCobrowseService.endSession as jest.Mock).mockResolvedValue(undefined);
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    expect(result.current.sessionState).toBe('inactive');
    expect(result.current.sessionCode).toBeNull();
    expect(result.current.showConsent).toBe(false);
    expect(result.current.requestCobrowse).toBeDefined();
    expect(result.current.acceptConsent).toBeDefined();
    expect(result.current.declineConsent).toBeDefined();
    expect(result.current.endSession).toBeDefined();
  });

  it('should show consent when requesting cobrowse', () => {
    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    act(() => {
      result.current.requestCobrowse();
    });

    expect(result.current.showConsent).toBe(true);
  });

  it('should handle consent acceptance and session creation', async () => {
    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Request cobrowse
    act(() => {
      result.current.requestCobrowse();
    });

    // Accept consent
    await act(async () => {
      await result.current.acceptConsent();
    });

    expect(mockCobrowseService.initialize).toHaveBeenCalled();
    expect(mockCobrowseService.createSession).toHaveBeenCalled();
    expect(result.current.showConsent).toBe(false);
    expect(result.current.sessionState).toBe('pending');
    expect(result.current.sessionCode).toBe('test-session-code');
  });

  it('should handle consent decline', () => {
    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Request cobrowse
    act(() => {
      result.current.requestCobrowse();
    });

    // Decline consent
    act(() => {
      result.current.declineConsent();
    });

    expect(result.current.showConsent).toBe(false);
    expect(result.current.sessionState).toBe('inactive');
    expect(result.current.sessionCode).toBeNull();
  });

  it('should handle session ending', async () => {
    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Start a session
    act(() => {
      result.current.requestCobrowse();
    });
    await act(async () => {
      await result.current.acceptConsent();
    });

    // End session
    await act(async () => {
      await result.current.endSession();
    });

    expect(mockCobrowseService.endSession).toHaveBeenCalled();
    expect(result.current.sessionState).toBe('inactive');
    expect(result.current.sessionCode).toBeNull();
  });

  it('should handle initialization errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (mockCobrowseService.initialize as jest.Mock).mockRejectedValue(
      new Error('Initialization failed'),
    );

    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Request cobrowse
    act(() => {
      result.current.requestCobrowse();
    });

    // Accept consent
    await act(async () => {
      await result.current.acceptConsent();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error starting cobrowse session:',
      expect.any(Error),
    );
    expect(result.current.sessionState).toBe('inactive');
    expect(result.current.sessionCode).toBeNull();
    consoleSpy.mockRestore();
  });

  it('should handle session ending errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    (mockCobrowseService.endSession as jest.Mock).mockRejectedValue(
      new Error('End session failed'),
    );

    const { result } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Start a session
    act(() => {
      result.current.requestCobrowse();
    });
    await act(async () => {
      await result.current.acceptConsent();
    });

    // End session
    await act(async () => {
      await result.current.endSession();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error ending cobrowse session:',
      expect.any(Error),
    );
    consoleSpy.mockRestore();
  });

  it('should cleanup active session on unmount', async () => {
    const { result, unmount } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Start a session
    act(() => {
      result.current.requestCobrowse();
    });
    await act(async () => {
      await result.current.acceptConsent();
    });

    // Unmount the component
    unmount();

    expect(mockCobrowseService.endSession).toHaveBeenCalled();
  });

  it('should not cleanup inactive session on unmount', () => {
    const { unmount } = renderHook(() =>
      useCobrowse({
        cobrowseService: mockCobrowseService as unknown as CobrowseService,
      }),
    );

    // Unmount the component
    unmount();

    expect(mockCobrowseService.endSession).not.toHaveBeenCalled();
  });
});
