export class CobrowseService {
  constructor() {
    // Empty constructor
  }

  initialize = jest.fn().mockResolvedValue({});
  createSession = jest.fn().mockResolvedValue('test-code');
  endSession = jest.fn().mockResolvedValue({});
}
