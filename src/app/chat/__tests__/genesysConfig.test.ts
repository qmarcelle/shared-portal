import { z } from 'zod';
import {
  ChatConfigSchema,
  createGenesysConfig,
  type GenesysConfig,
} from '../schemas/genesys.schema';

describe('Genesys Configuration', () => {
  const validConfig: GenesysConfig = {
    chatbotEligible: true,
    routingchatbotEligible: true,
    clientId: 'test-client',
    chatUrl: 'https://test.chat.url',
    environment: 'test',
    debug: false,
    isChatAvailable: true,
    memberCk: 'test-member',
    userRole: 'MEMBER',
    isAmplifyMem: false,
    isDemoMember: false,
    isDental: false,
    isMedical: true,
    isVision: false,
    isWellnessOnly: false,
    isCobraEligible: false,
    groupType: 'medical',
    isIDCardEligible: true,
    calculatedCiciId: 'test-cici',
    clickToChatEndPoint: 'https://test.chat.endpoint',
    chatGroup: 'default',
    workingHours: '8:00 AM - 5:00 PM',
    rawChatHrs: '8:00 AM - 5:00 PM',
    cloudChatEligible: false,
  };

  describe('ChatConfigSchema', () => {
    it('validates a complete valid configuration', () => {
      const result = ChatConfigSchema.safeParse(validConfig);
      expect(result.success).toBe(true);
    });

    it('validates required fields with defaults', () => {
      const minimalConfig = {};
      const result = ChatConfigSchema.safeParse(minimalConfig);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.chatbotEligible).toBe(true);
        expect(result.data.routingchatbotEligible).toBe(true);
        expect(result.data.isChatAvailable).toBe(true);
      }
    });

    it('validates optional fields', () => {
      const minimalConfig = {
        chatbotEligible: true,
        routingchatbotEligible: true,
        clientId: 'test-client',
        chatUrl: 'https://test.chat.url',
      };
      const result = ChatConfigSchema.safeParse(minimalConfig);
      expect(result.success).toBe(true);
    });

    it('validates field types', () => {
      const invalidConfig = {
        ...validConfig,
        chatbotEligible: 'invalid-string', // should be boolean
        memberCk: 12345, // should be string
      };
      const result = ChatConfigSchema.safeParse(invalidConfig);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBe(2);
      }
    });
  });

  describe('createGenesysConfig', () => {
    it('creates config with default values', () => {
      const minimalConfig = {
        clientId: 'test-client',
        chatUrl: 'https://test.chat.url',
      };
      const config = createGenesysConfig(minimalConfig);
      expect(config.chatbotEligible).toBe(true);
      expect(config.routingchatbotEligible).toBe(true);
      expect(config.clientId).toBe('test-client');
      expect(config.chatUrl).toBe('https://test.chat.url');
      expect(config.isChatAvailable).toBe(true);
      expect(config.isAmplifyMem).toBe(false);
      expect(config.cloudChatEligible).toBe(false);
    });

    it('overrides default values with provided values', () => {
      const config = createGenesysConfig(validConfig);
      expect(config).toEqual(validConfig);
    });

    it('handles partial configuration', () => {
      const partialConfig = {
        clientId: 'test-client',
        chatUrl: 'https://test.chat.url',
        memberCk: '12345',
      };
      const config = createGenesysConfig(partialConfig);
      expect(config.memberCk).toBe('12345');
      expect(config.isChatAvailable).toBe(true);
      expect(config.isAmplifyMem).toBe(false);
    });

    it('validates configuration before creating', () => {
      const invalidConfig = {
        chatbotEligible: 'invalid-string', // should be boolean
        clientId: 'test-client',
        chatUrl: 'https://test.chat.url',
      };
      expect(() => createGenesysConfig(invalidConfig)).toThrow(z.ZodError);
    });
  });
});
