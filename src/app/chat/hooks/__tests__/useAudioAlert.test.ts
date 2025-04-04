import { renderHook } from '@testing-library/react';
import { useAudioAlert } from '../useAudioAlert';

const mockPlay = jest.fn();
const mockPause = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Mock Audio API
const mockAudio = {
  play: mockPlay,
  pause: mockPause,
  addEventListener: mockAddEventListener,
  removeEventListener: mockRemoveEventListener,
};

jest.mock('global', () => ({
  Audio: jest.fn(() => mockAudio),
}));

describe('useAudioAlert', () => {
  const audioPath = '/audio/notification.mp3';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle SSR environment', () => {
    const { result } = renderHook(() => useAudioAlert(audioPath));
    expect(result.current).toBeDefined();
  });

  it('should initialize audio with correct source', () => {
    renderHook(() => useAudioAlert(audioPath));
    expect(global.Audio).toHaveBeenCalledWith(audioPath);
  });

  it('should play audio when triggered', () => {
    const { result } = renderHook(() => useAudioAlert(audioPath));
    result.current.initializeAudio();
    result.current.playAlert();
    expect(mockPlay).toHaveBeenCalled();
  });

  it('should handle cleanup on unmount', () => {
    const { unmount } = renderHook(() => useAudioAlert(audioPath));
    unmount();
    expect(mockRemoveEventListener).toHaveBeenCalled();
  });
});
