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

describe('ChatDataPayload', () => {
  it('should create valid chat settings for medical plan', () => {
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
      userData: expect.objectContaining({
        PLAN_ID: 'GROUP123',
        IsMedicalEligibile: true
      })
    }));
  });
  
  it('should handle missing required fields', () => {
    const incompleteUserData = {
      memberId: '12345'
      // Missing other fields
    };
    
    expect(() => createChatSettings(incompleteUserData, 'cloud'))
      .toThrow(/required field/i);
  });
  
  it('should set appropriate eligibility flags based on plan type', () => {
    const dentalUserData = {
      memberId: '12345',
      planId: 'GROUP123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      planType: 'Dental'
    };
    
    const settings = createChatSettings(dentalUserData, 'cloud');
    
    expect(settings.userData.IsDentalEligible).toBe(true);
    expect(settings.userData.IsMedicalEligibile).toBe(false);
    expect(settings.userData.IsVisionEligible).toBe(false);
  });
  
  it('should include all required fields for Genesys payload', () => {
    const userData = {
      memberId: '12345',
      planId: 'GROUP123',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      planType: 'Medical'
    };
    
    const settings = createChatSettings(userData, 'cloud');
    
    const requiredFields = [
      'PLAN_ID', 'GROUP_ID', 'LOB', 'lob_group', 
      'IsMedicalEligibile', 'IsDentalEligible', 'IsVisionEligible',
      'Origin', 'Source'
    ];
    
    requiredFields.forEach(field => {
      expect(settings.userData).toHaveProperty(field);
    });
  });
});