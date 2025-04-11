import { ChatService, loadGenesysScript } from '../../services/ChatService';
import { ChatDataPayload, ChatError } from '../../types/index';

// Mock fetch globally
global.fetch = jest.fn();

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
    chatService = new ChatService(
      'test-member',
      'test-plan',
      'Test Plan',
      false,
      jest.fn(),
    );
  });

  const mockPayload: ChatDataPayload = {
    PLAN_ID: 'PLAN_123',
    GROUP_ID: 'GROUP_123',
    LOB: 'Medical',
    lob_group: 'group1',
    IsMedicalEligibile: true,
    IsDentalEligible: false,
    IsVisionEligible: false,
    Origin: 'MemberPortal',
    Source: 'Web',
  };

  describe('getChatInfo', () => {
    it('returns chat info on successful response', async () => {
      const mockResponse = {
        chatAvailable: true,
        businessHours: {
          start: '09:00',
          end: '17:00',
          timezone: 'America/New_York',
        },
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await chatService.getChatInfo();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/info');
    });

    it('throws ChatError on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(chatService.getChatInfo()).rejects.toThrow(ChatError);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/info');
    });

    it('throws ChatError on network error', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error'),
      );

      await expect(chatService.getChatInfo()).rejects.toThrow(ChatError);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/info');
    });
  });

  describe('startChat', () => {
    it('starts chat session successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await chatService.startChat(mockPayload);
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockPayload),
      });
    });

    it('throws ChatError on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(chatService.startChat(mockPayload)).rejects.toThrow(
        ChatError,
      );
    });
  });

  describe('endChat', () => {
    it('ends chat session successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await chatService.endChat();
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/end', {
        method: 'POST',
      });
    });

    it('throws ChatError on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(chatService.endChat()).rejects.toThrow(ChatError);
    });
  });

  describe('sendMessage', () => {
    it('sends message successfully', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await chatService.sendMessage('Hello');
      expect(global.fetch).toHaveBeenCalledWith('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'Hello' }),
      });
    });

    it('throws ChatError on failed response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(chatService.sendMessage('Hello')).rejects.toThrow(ChatError);
    });
  });
});

describe('loadGenesysScript', () => {
  let appendChildSpy: jest.SpyInstance;
  let querySelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    appendChildSpy = jest.spyOn(document.head, 'appendChild');
    querySelectorSpy = jest.spyOn(document, 'querySelector');
  });

  afterEach(() => {
    appendChildSpy.mockRestore();
    querySelectorSpy.mockRestore();
  });

  it('loads script successfully', async () => {
    querySelectorSpy.mockReturnValue(null);
    const scriptUrl = 'https://example.com/script.js';

    const loadPromise = loadGenesysScript(scriptUrl);

    // Get the script element that was created
    const scriptElement = appendChildSpy.mock.calls[0][0] as HTMLScriptElement;

    // Simulate script load
    scriptElement.onload?.(new Event('load'));

    await expect(loadPromise).resolves.toBeUndefined();
    expect(scriptElement.src).toBe(scriptUrl);
    expect(scriptElement.async).toBe(true);
  });

  it('resolves immediately if script already exists', async () => {
    querySelectorSpy.mockReturnValue(document.createElement('script'));

    await loadGenesysScript('https://example.com/script.js');
    expect(appendChildSpy).not.toHaveBeenCalled();
  });

  it('rejects on script load error', async () => {
    querySelectorSpy.mockReturnValue(null);
    const scriptUrl = 'https://example.com/script.js';

    const loadPromise = loadGenesysScript(scriptUrl);

    // Get the script element that was created
    const scriptElement = appendChildSpy.mock.calls[0][0] as HTMLScriptElement;

    // Simulate script error
    scriptElement.onerror?.(new Event('error'));

    await expect(loadPromise).rejects.toThrow('Failed to load script');
  });
});
