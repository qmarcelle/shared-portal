import { ChatConfig } from '../../models/chat';
import { CobrowseService } from '../../utils/CobrowseService';

// Mock the CobrowseIO global object
const mockCobrowseIO = {
  license: '',
  customData: {},
  capabilities: [],
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  createSessionCode: jest.fn().mockResolvedValue('MOCK-CODE'),
  confirmSession: jest.fn(),
  confirmRemoteControl: jest.fn(),
};

// Mock the document.createElement and appendChild functions
document.createElement = jest.fn().mockImplementation(() => ({
  src: '',
  async: false,
  onload: null,
  onerror: null,
}));

document.head.appendChild = jest.fn();

describe('CobrowseService', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Set up window.CobrowseIO
    window.CobrowseIO = undefined;
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
  
  test('initialize should load the CobrowseIO script', async () => {
    const service = new CobrowseService(mockConfig);
    const loadScriptSpy = jest.spyOn(service as any, 'loadScript').mockResolvedValue(undefined);
    
    await service.initialize();
    
    expect(loadScriptSpy).toHaveBeenCalledWith('https://js.cobrowse.io/CobrowseIO.js');
    expect(document.createElement).toHaveBeenCalledWith('script');
    expect(document.head.appendChild).toHaveBeenCalled();
  });
  
  test('initialize should configure CobrowseIO with correct settings', async () => {
    const service = new CobrowseService(mockConfig);
    jest.spyOn(service as any, 'loadScript').mockResolvedValue(undefined);
    jest.spyOn(service as any, 'configureCobrowseConsent').mockImplementation(() => {});
    
    // Mock setting window.CobrowseIO after script load
    window.CobrowseIO = mockCobrowseIO;
    
    await service.initialize();
    
    expect(window.CobrowseIO.license).toBe(mockConfig.coBrowseLicence);
    expect(window.CobrowseIO.customData).toEqual({ 
      user_id: mockConfig.userID, 
      user_name: mockConfig.memberFirstname 
    });
    expect(window.CobrowseIO.capabilities).toEqual([
      'cursor', 'keypress', 'laser', 'pointer', 'scroll', 'select'
    ]);
    expect(window.CobrowseIO.start).toHaveBeenCalled();
  });
  
  test('initialize should not reload script if already initialized', async () => {
    const service = new CobrowseService(mockConfig);
    const loadScriptSpy = jest.spyOn(service as any, 'loadScript').mockResolvedValue(undefined);
    
    // First initialization
    await service.initialize();
    
    // Reset spy
    loadScriptSpy.mockClear();
    
    // Second initialization
    await service.initialize();
    
    // Script should not be loaded again
    expect(loadScriptSpy).not.toHaveBeenCalled();
  });
  
  test('createSession should initialize if not already initialized', async () => {
    const service = new CobrowseService(mockConfig);
    const initializeSpy = jest.spyOn(service, 'initialize').mockResolvedValue(undefined);
    
    // Mock setting window.CobrowseIO
    window.CobrowseIO = mockCobrowseIO;
    
    await service.createSession();
    
    expect(initializeSpy).toHaveBeenCalled();
    expect(window.CobrowseIO.createSessionCode).toHaveBeenCalled();
  });
  
  test('createSession should return the session code', async () => {
    const service = new CobrowseService(mockConfig);
    jest.spyOn(service, 'initialize').mockResolvedValue(undefined);
    
    // Mock setting window.CobrowseIO
    window.CobrowseIO = mockCobrowseIO;
    
    const code = await service.createSession();
    
    expect(code).toBe('MOCK-CODE');
  });
  
  test('endSession should call CobrowseIO.stop', async () => {
    const service = new CobrowseService(mockConfig);
    
    // Mock setting window.CobrowseIO
    window.CobrowseIO = mockCobrowseIO;
    
    await service.endSession();
    
    expect(window.CobrowseIO.stop).toHaveBeenCalled();
  });
  
  test('endSession should handle case when CobrowseIO is not initialized', async () => {
    const service = new CobrowseService(mockConfig);
    
    // Set CobrowseIO to undefined
    window.CobrowseIO = undefined;
    
    // Should not throw
    await expect(service.endSession()).resolves.not.toThrow();
  });
  
  test('configureCobrowseConsent should set up confirmation dialogs', async () => {
    const service = new CobrowseService(mockConfig);
    
    // Mock setting window.CobrowseIO
    window.CobrowseIO = mockCobrowseIO;
    
    service['configureCobrowseConsent']();
    
    expect(typeof window.CobrowseIO.confirmSession).toBe('function');
    expect(typeof window.CobrowseIO.confirmRemoteControl).toBe('function');
  });
});

// Add typings for the global CobrowseIO object
declare global {
  interface Window {
    CobrowseIO: any;
  }
} 