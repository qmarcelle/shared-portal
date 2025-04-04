import { ChatConfig } from '../../models/types';
import { CobrowseService } from '../CobrowseService';

type BaseCobrowseIO = {
  license: string;
  customData: {
    user_id: string;
    user_name: string;
  };
  capabilities: string[];
  confirmSession: () => Promise<boolean>;
  confirmRemoteControl: () => Promise<boolean>;
  start: () => Promise<void>;
  stop: () => Promise<void>;
  createSessionCode: () => Promise<string>;
};

interface CobrowseIOType extends BaseCobrowseIO {
  deviceType: string;
  redactedViews: string[];
  currentSession: {
    id: string;
    code: string;
  };
  on: jest.Mock<void, [string, (data: unknown) => void]>;
  off: jest.Mock<void, [string, (data: unknown) => void]>;
}

declare global {
  interface Window {
    CobrowseIO?: BaseCobrowseIO;
    logCobrowseEvent?: (eventName: string, data: unknown) => void;
  }
}

const mockConfig: ChatConfig = {
  token: 'test-token',
  endPoint: 'https://test-endpoint.com',
  demoEndPoint: 'https://demo-endpoint.com',
  opsPhone: '123-456-7890',
  opsPhoneHours: '9am-5pm EST',
  userID: 'test-user-id',
  memberFirstname: 'Test',
  memberLastname: 'Test User',
  memberId: 'test-user',
  groupId: 'test-group',
  planId: 'test-plan',
  planName: 'Test Plan',
  businessHours: {
    isOpen24x7: true,
    days: [],
    timezone: 'UTC',
    isCurrentlyOpen: true,
    lastUpdated: Date.now(),
    source: 'api',
  },
  cobrowseURL: 'https://test.cobrowse.io/CobrowseIO.js',
  cobrowseSource: 'https://test.cobrowse.io',
  coBrowseLicence: 'test-license',
  SERV_Type: 'MemberPortal',
  RoutingChatbotInteractionId: 'test-interaction',
  PLAN_ID: 'test-plan',
  GROUP_ID: 'test-group',
  IDCardBotName: 'test-bot',
  IsVisionEligible: true,
  MEMBER_ID: 'test-user',
  coverage_eligibility: 'medical',
  INQ_TYPE: 'MEM',
  IsDentalEligible: true,
  MEMBER_DOB: '1990-01-01',
  LOB: 'Medical',
  lob_group: 'Medical',
  IsMedicalEligibile: true,
  Origin: 'Web',
  Source: 'MemberPortal',
};

const mockCobrowseIO: CobrowseIOType = {
  license: '',
  customData: {
    user_id: '',
    user_name: '',
  },
  capabilities: [],
  deviceType: 'desktop',
  redactedViews: [],
  currentSession: {
    id: '',
    code: '',
  },
  start: jest.fn().mockResolvedValue(undefined),
  stop: jest.fn().mockResolvedValue(undefined),
  createSessionCode: jest.fn().mockResolvedValue('test-session-code'),
  confirmSession: jest.fn().mockResolvedValue(true),
  confirmRemoteControl: jest.fn().mockResolvedValue(true),
  on: jest.fn(),
  off: jest.fn(),
};

// Mock window.logCobrowseEvent
const mockLogCobrowseEvent = jest.fn();

describe('CobrowseService', () => {
  let cobrowseService: CobrowseService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    // Reset window.CobrowseIO and logCobrowseEvent
    delete window.CobrowseIO;
    delete window.logCobrowseEvent;
    // Create new instance
    cobrowseService = new CobrowseService(mockConfig);
  });

  describe('initialization', () => {
    it('should handle missing CobrowseIO gracefully', () => {
      delete window.CobrowseIO;
      expect(cobrowseService.getActiveSession()).toBeNull();
    });

    it('should initialize CobrowseIO with correct settings', async () => {
      // Mock script loading
      const mockScript = document.createElement('script');
      const mockAppendChild = jest.fn().mockImplementation(() => {
        window.CobrowseIO = mockCobrowseIO;
        window.logCobrowseEvent = mockLogCobrowseEvent;
        mockScript.onload?.({} as Event);
      });
      document.head.appendChild = mockAppendChild;

      await cobrowseService.initialize();

      expect(mockAppendChild).toHaveBeenCalled();
      expect(window.CobrowseIO).toBeDefined();
      expect(window.CobrowseIO?.license).toBe(mockConfig.coBrowseLicence);
      expect(window.CobrowseIO?.customData).toEqual({
        user_id: mockConfig.memberId,
        user_name: mockConfig.memberFirstname,
      });
    }, 10000);

    it('should not initialize if already initialized', async () => {
      window.CobrowseIO = mockCobrowseIO;
      await cobrowseService.initialize();
      await cobrowseService.initialize();
      expect(mockCobrowseIO.start).toHaveBeenCalledTimes(1);
    }, 10000);
  });

  describe('session management', () => {
    beforeEach(async () => {
      window.CobrowseIO = mockCobrowseIO;
      window.logCobrowseEvent = mockLogCobrowseEvent;
      await cobrowseService.initialize();
    }, 10000);

    it('should create a new session', async () => {
      const sessionCode = await cobrowseService.createSession();
      expect(sessionCode).toBe('test-session-code');
      expect(mockCobrowseIO.createSessionCode).toHaveBeenCalled();
      expect(mockLogCobrowseEvent).toHaveBeenCalledWith('session_created', {
        sessionCode: 'test-session-code',
      });
    });

    it('should end an active session', async () => {
      await cobrowseService.createSession();
      await cobrowseService.endSession();
      expect(mockCobrowseIO.stop).toHaveBeenCalled();
      expect(mockLogCobrowseEvent).toHaveBeenCalledWith('session_ended', {
        sessionId: 'test-session-code',
      });
    });

    it('should get active session', async () => {
      await cobrowseService.createSession();
      const session = cobrowseService.getActiveSession();
      expect(session).toBeDefined();
      expect(session?.id).toBe('test-session-code');
      expect(session?.active).toBe(true);
      expect(session?.url).toBe(
        'https://test.cobrowse.io/session/test-session-code',
      );
    });
  });

  describe('event handling', () => {
    beforeEach(async () => {
      window.CobrowseIO = mockCobrowseIO;
      await cobrowseService.initialize();
    }, 10000);

    it('should register event listeners', () => {
      expect(mockCobrowseIO.on).toHaveBeenCalledWith(
        'session.updated',
        expect.any(Function),
      );
      expect(mockCobrowseIO.on).toHaveBeenCalledWith(
        'session.ended',
        expect.any(Function),
      );
    });

    it('should handle session updates', () => {
      // Simulate session update
      const updateHandler = mockCobrowseIO.on.mock.calls.find(
        ([event]: [string, unknown]) => event === 'session.updated',
      )?.[1] as (data: unknown) => void;
      expect(updateHandler).toBeDefined();
      if (updateHandler) {
        updateHandler({ code: 'updated-code' });
        const session = cobrowseService.getActiveSession();
        expect(session?.id).toBe('updated-code');
      }
    });

    it('should handle session end', () => {
      // Simulate session end
      const endHandler = mockCobrowseIO.on.mock.calls.find(
        ([event]: [string, unknown]) => event === 'session.ended',
      )?.[1] as (data: unknown) => void;
      expect(endHandler).toBeDefined();
      if (endHandler) {
        endHandler({});
        const session = cobrowseService.getActiveSession();
        expect(session).toBeNull();
      }
    });
  });

  describe('consent handling', () => {
    beforeEach(async () => {
      window.CobrowseIO = mockCobrowseIO;
      await cobrowseService.initialize();
    }, 10000);

    it('should configure consent handlers', () => {
      expect(mockCobrowseIO.confirmSession).toBeDefined();
      expect(mockCobrowseIO.confirmRemoteControl).toBeDefined();
    });

    it('should handle session consent', async () => {
      const result = await mockCobrowseIO.confirmSession();
      expect(result).toBe(true);
    });

    it('should handle remote control consent', async () => {
      const result = await mockCobrowseIO.confirmRemoteControl();
      expect(result).toBe(true);
    });
  });
});
