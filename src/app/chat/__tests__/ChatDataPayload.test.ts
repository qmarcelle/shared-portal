import { createChatSettings } from '../utils/chatUtils';

// Mock the logger to avoid console noise during tests
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock environment variables
process.env.NEXT_PUBLIC_LEGACY_CHAT_URL = 'https://test.com/chat';
process.env.NEXT_PUBLIC_GENESYS_BOOTSTRAP_URL = 'https://test.com/bootstrap';
process.env.NEXT_PUBLIC_GENESYS_CLICK_TO_CHAT_JS = 'https://test.com/click2chat.js';
process.env.NEXT_PUBLIC_CLICK_TO_CHAT_ENDPOINT = 'https://test.com/c2c';
process.env.NEXT_PUBLIC_CHAT_TOKEN_ENDPOINT = 'https://test.com/token';
process.env.NEXT_PUBLIC_COBROWSE_LICENSE_ENDPOINT = 'https://test.com/cobrowse';
process.env.NEXT_PUBLIC_OPS_PHONE = '123-456-7890';
process.env.NEXT_PUBLIC_OPS_HOURS = 'M-F 8-5';

describe('ChatDataPayload', () => {
  it('should create settings with correct environment variables', () => {
    const userData = {
      memberId: '12345',
      planId: 'GROUP123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      planType: 'Medical'
    };
    
    const settings = createChatSettings(userData, 'cloud');
    
    expect(settings).toEqual(expect.objectContaining({
      widgetUrl: 'https://test.com/chat',
      bootstrapUrl: 'https://test.com/bootstrap',
      memberId: '12345',
      planId: 'GROUP123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      planType: 'Medical'
    }));
  });
  
  it('should handle null or undefined values gracefully', () => {
    const dataWithNulls = {
      memberId: '12345',
      planId: null,
      firstName: undefined,
      lastName: 'Doe'
    };
    
    const settings = createChatSettings(dataWithNulls, 'cloud');
    
    expect(settings.planId).toBe('');
    expect(settings.firstName).toBe('');
    expect(settings.lastName).toBe('Doe');
  });
  
  it('should convert object values to JSON strings', () => {
    const dataWithObject = {
      memberId: '12345',
      preferences: { theme: 'dark', notifications: true }
    };
    
    const settings = createChatSettings(dataWithObject, 'cloud');
    
    expect(settings.preferences).toBe('{"theme":"dark","notifications":true}');
  });
  
  it('should include user data from provided input', () => {
    const userData = {
      memberId: '12345',
      planId: 'GROUP123',
      customField: 'custom value'
    };
    
    const settings = createChatSettings(userData, 'cloud');
    
    expect(settings).toHaveProperty('customField', 'custom value');
  });
});