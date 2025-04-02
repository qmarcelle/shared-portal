import { ChatConfig } from '../../models/chat';
import { GenesysChatService } from '../../utils/GenesysChatService';

// Mock fetch
global.fetch = jest.fn();

describe('GenesysChatService', () => {
  // Mock reset
  beforeEach(() => {
    jest.resetAllMocks();
  });
  
  const mockConfig: ChatConfig = {
    endPoint: 'https://api.example.com',
    demoEndPoint: 'https://demo-api.example.com',
    token: 'test-token',
    coBrowseLicence: 'license-123',
    cobrowseSource: 'source',
    cobrowseURL: 'https://cobrowse.example.com',
    opsPhone: '1-800-123-4567',
    opsPhoneHours: 'Monday-Friday 8am-5pm',
  };
  
  const mockUserData = {
    firstname: 'John',
    lastname: 'Doe',
    MEMBER_ID: '12345',
    GROUP_ID: 'GROUP1',
    PLAN_ID: 'PLAN1',
    SERV_TYPE: 'Benefits',
    LOB: 'BC',
    INQ_TYPE: 'BlueCare_Chat'
  };
  
  test('initialize should call the correct endpoint with proper data', async () => {
    const mockedFetch = global.fetch as jest.Mock;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'chat-session-123' }),
    });
    
    const service = new GenesysChatService(mockConfig);
    service.isDemoMember = false;
    
    const result = await service.initialize(mockUserData);
    
    expect(mockedFetch).toHaveBeenCalledWith(
      `${mockConfig.endPoint}/api/v2/webchat/guest/conversations`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockConfig.token}`
        }),
        body: expect.stringContaining(mockUserData.firstname)
      })
    );
    
    expect(result).toEqual({ sessionId: 'chat-session-123' });
  });
  
  test('initialize should use demo endpoint when isDemoMember is true', async () => {
    const mockedFetch = global.fetch as jest.Mock;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'chat-session-123' }),
    });
    
    const service = new GenesysChatService(mockConfig);
    service.isDemoMember = true;
    
    await service.initialize(mockUserData);
    
    expect(mockedFetch).toHaveBeenCalledWith(
      `${mockConfig.demoEndPoint}/api/v2/webchat/guest/conversations`,
      expect.any(Object)
    );
  });
  
  test('initialize should throw error when API call fails', async () => {
    const mockedFetch = global.fetch as jest.Mock;
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Server Error',
    });
    
    const service = new GenesysChatService(mockConfig);
    service.isDemoMember = false;
    
    await expect(service.initialize(mockUserData)).rejects.toThrow(
      'Failed to initialize chat: Server Error'
    );
  });
  
  test('sendMessage should send message to the correct endpoint', async () => {
    const mockedFetch = global.fetch as jest.Mock;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
    });
    
    const service = new GenesysChatService(mockConfig);
    service.isDemoMember = false;
    // Set session ID manually for testing
    service.sessionId = 'chat-session-123';
    
    await service.sendMessage('Hello, world!');
    
    expect(mockedFetch).toHaveBeenCalledWith(
      `${mockConfig.endPoint}/api/v2/webchat/guest/conversations/chat-session-123/messages`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockConfig.token}`
        }),
        body: JSON.stringify({
          body: 'Hello, world!',
          bodyType: 'standard'
        })
      })
    );
  });
  
  test('sendMessage should throw error when no sessionId', async () => {
    const service = new GenesysChatService(mockConfig);
    service.sessionId = null;
    
    await expect(service.sendMessage('Hello')).rejects.toThrow(
      'Chat session not initialized'
    );
  });
  
  test('disconnect should call the correct endpoint', async () => {
    const mockedFetch = global.fetch as jest.Mock;
    mockedFetch.mockResolvedValueOnce({
      ok: true,
    });
    
    const service = new GenesysChatService(mockConfig);
    service.isDemoMember = false;
    // Set session ID manually for testing
    service.sessionId = 'chat-session-123';
    
    await service.disconnect();
    
    expect(mockedFetch).toHaveBeenCalledWith(
      `${mockConfig.endPoint}/api/v2/webchat/guest/conversations/chat-session-123`,
      expect.objectContaining({
        method: 'DELETE',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${mockConfig.token}`
        })
      })
    );
    
    // Should clear sessionId
    expect(service.sessionId).toBeNull();
  });
  
  test('disconnect should do nothing when no sessionId', async () => {
    const mockedFetch = global.fetch as jest.Mock;
    
    const service = new GenesysChatService(mockConfig);
    service.sessionId = null;
    
    await service.disconnect();
    
    expect(mockedFetch).not.toHaveBeenCalled();
  });
}); 