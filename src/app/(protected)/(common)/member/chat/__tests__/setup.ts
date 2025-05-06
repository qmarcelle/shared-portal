import '@testing-library/jest-dom';

// Mock image imports
jest.mock('*.png', () => 'mock-image-url');
jest.mock('*.svg', () => 'mock-svg-url');
jest.mock('*.jpg', () => 'mock-jpg-url');
jest.mock('*.jpeg', () => 'mock-jpeg-url');

// Mock Genesys global object
const mockGenesys = {
  Chat: {
    createChatWidget: jest.fn(),
    updateUserData: jest.fn(),
    setBusinessHours: jest.fn(),
    setTheme: jest.fn(),
  },
  WebMessenger: {
    init: jest.fn(),
  },
};

// Set up global Genesys mock
(global as any).Genesys = mockGenesys;

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();

  // Reset Genesys mock methods
  mockGenesys.Chat.createChatWidget.mockReset();
  mockGenesys.Chat.updateUserData.mockReset();
  mockGenesys.Chat.setBusinessHours.mockReset();
  mockGenesys.Chat.setTheme.mockReset();
  mockGenesys.WebMessenger.init.mockReset();
});
