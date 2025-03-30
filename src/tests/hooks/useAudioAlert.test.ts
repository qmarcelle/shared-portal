import { act, renderHook } from '@testing-library/react-hooks';
import { useAudioAlert } from '../../utils/useAudioAlert';

// Mock Audio class
class MockAudio {
  src: string;
  muted: boolean = true;
  play: jest.Mock;
  
  constructor(src: string) {
    this.src = src;
    this.play = jest.fn().mockResolvedValue(undefined);
  }
}

describe('useAudioAlert', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Audio = MockAudio;
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test('should initialize audio with muted state', () => {
    const { result } = renderHook(() => useAudioAlert('/test-audio.mp3'));
    
    expect(result.current.initialized).toBe(false);
    
    act(() => {
      result.current.initializeAudio();
    });
    
    expect(result.current.initialized).toBe(true);
  });
  
  test('should play audio when playAlert is called', () => {
    const { result } = renderHook(() => useAudioAlert('/test-audio.mp3'));
    
    act(() => {
      result.current.initializeAudio();
    });
    
    act(() => {
      result.current.playAlert();
    });
    
    // @ts-ignore
    const mockedAudio = new global.Audio('/test-audio.mp3');
    expect(mockedAudio.play).toHaveBeenCalled();
    expect(mockedAudio.muted).toBe(true); // Our mock starts muted
  });
  
  test('should handle errors when playing audio', () => {
    // Mock console.error to prevent test output noise
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // Mock play to reject
    class ErrorAudio extends MockAudio {
      constructor(src: string) {
        super(src);
        this.play = jest.fn().mockRejectedValue(new Error('Audio playback failed'));
      }
    }
    
    // @ts-ignore
    global.Audio = ErrorAudio;
    
    const { result } = renderHook(() => useAudioAlert('/test-audio.mp3'));
    
    act(() => {
      result.current.initializeAudio();
    });
    
    act(() => {
      result.current.playAlert();
    });
    
    // @ts-ignore
    const mockedAudio = new global.Audio('/test-audio.mp3');
    expect(mockedAudio.play).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error playing alert sound:', expect.any(Error));
    
    // Clean up
    consoleErrorSpy.mockRestore();
  });
}); 