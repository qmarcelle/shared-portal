import { ChatDataPayload, ChatError } from '@/app/chat/types/index';
import { ChatService, loadGenesysScript } from '../ChatService';

describe('ChatService', () => {
  let chatService: ChatService;

  beforeEach(() => {
    chatService = new ChatService(
      'test-member',
      'test-plan',
      'Test Plan',
      false,
      jest.fn(),
    );
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('loadGenesysScript', () => {
    let appendChildSpy: jest.SpyInstance;
    let querySelectorSpy: jest.SpyInstance;

    beforeEach(() => {
      appendChildSpy = jest.spyOn(document.head, 'appendChild');
      querySelectorSpy = jest.spyOn(document, 'getElementById');
    });

    afterEach(() => {
      appendChildSpy.mockRestore();
      querySelectorSpy.mockRestore();
    });

    it('should load script successfully', async () => {
      const scriptUrl = 'https://test.com/chat.js';
      const loadPromise = loadGenesysScript(scriptUrl);

      // Simulate script load synchronously
      const scriptElement = document.createElement('script');
      appendChildSpy.mockImplementation(() => {
        scriptElement.dispatchEvent(new Event('load'));
        return scriptElement;
      });

      await expect(loadPromise).resolves.not.toThrow();
    }, 10000); // Increase timeout

    it('should handle script load error', async () => {
      const scriptUrl = 'https://test.com/chat.js';
      const loadPromise = loadGenesysScript(scriptUrl);

      // Simulate script error synchronously
      const scriptElement = document.createElement('script');
      appendChildSpy.mockImplementation(() => {
        scriptElement.dispatchEvent(new Event('error'));
        return scriptElement;
      });

      await expect(loadPromise).rejects.toThrow(
        'Failed to load Genesys chat script',
      );
    }, 10000); // Increase timeout

    it('should not load script twice', async () => {
      const scriptUrl = 'https://test.com/chat.js';
      const existingScript = document.createElement('script');
      existingScript.id = 'cx-widget-script';
      querySelectorSpy.mockReturnValue(existingScript);

      await loadGenesysScript(scriptUrl);
      expect(appendChildSpy).toHaveBeenCalledTimes(1);
    }, 10000); // Increase timeout
  });

  describe('ChatService Implementation', () => {
    describe('getChatInfo', () => {
      it('should fetch chat info successfully', async () => {
        const mockResponse = { chatAvailable: true };
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve(mockResponse),
        });

        const result = await chatService.getChatInfo();
        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith('/api/chat/info');
      });

      it('should handle API error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        });

        await expect(chatService.getChatInfo()).rejects.toThrow(
          new ChatError('Failed to fetch chat info', 'API_ERROR'),
        );
      });
    });

    describe('startChat', () => {
      it('should start chat successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
        });

        const mockPayload: ChatDataPayload = {
          PLAN_ID: 'test-plan',
          GROUP_ID: 'test-group',
          LOB: 'Medical',
          lob_group: 'Medical_Group',
          IsMedicalEligibile: true,
          IsDentalEligible: false,
          IsVisionEligible: false,
          Origin: 'MemberPortal',
          Source: 'Web',
        };

        await expect(chatService.startChat(mockPayload)).resolves.not.toThrow();
        expect(global.fetch).toHaveBeenCalledWith('/api/chat/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPayload),
        });
      });

      it('should handle API error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        });

        const mockPayload: ChatDataPayload = {
          PLAN_ID: 'test-plan',
          GROUP_ID: 'test-group',
          LOB: 'Medical',
          lob_group: 'Medical_Group',
          IsMedicalEligibile: true,
          IsDentalEligible: false,
          IsVisionEligible: false,
          Origin: 'MemberPortal',
          Source: 'Web',
        };

        await expect(chatService.startChat(mockPayload)).rejects.toThrow(
          new ChatError('Failed to start chat', 'API_ERROR'),
        );
      });
    });

    describe('endChat', () => {
      it('should end chat successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
        });

        await expect(chatService.endChat()).resolves.not.toThrow();
        expect(global.fetch).toHaveBeenCalledWith('/api/chat/end', {
          method: 'POST',
        });
      });

      it('should handle API error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        });

        await expect(chatService.endChat()).rejects.toThrow(
          new ChatError('Failed to end chat', 'API_ERROR'),
        );
      });
    });

    describe('sendMessage', () => {
      it('should send message successfully', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
        });

        const message = 'test message';
        await expect(chatService.sendMessage(message)).resolves.not.toThrow();
        expect(global.fetch).toHaveBeenCalledWith('/api/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: message }),
        });
      });

      it('should handle API error', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: false,
        });

        await expect(chatService.sendMessage('test')).rejects.toThrow(
          new ChatError('Failed to send message', 'API_ERROR'),
        );
      });
    });

    describe('getAuthToken', () => {
      it('should throw not implemented error', async () => {
        await expect(chatService.getAuthToken()).rejects.toThrow(
          'Method not implemented.',
        );
      });
    });
  });
});
