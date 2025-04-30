// Global Test Environment Types
interface Global {
  fetch: jest.Mock;
  Date: DateConstructor;
  Audio: any;
  ResizeObserver: any;
  jest: typeof jest;
}

declare global {
  var jest: typeof import('@jest/globals').jest;
  var describe: typeof import('@jest/globals').describe;
  var beforeEach: typeof import('@jest/globals').beforeEach;
  var afterEach: typeof import('@jest/globals').afterEach;
  var beforeAll: typeof import('@jest/globals').beforeAll;
  var afterAll: typeof import('@jest/globals').afterAll;
  var test: typeof import('@jest/globals').test;
  var it: typeof import('@jest/globals').it;
  var expect: typeof import('@jest/globals').expect;

  namespace jest {
    interface Mock<T = any, Y extends any[] = any[]> {
      (...args: Y): T;
      mockImplementation: (fn: (...args: Y) => T) => Mock<T, Y>;
      mockResolvedValue: (value: T) => Mock<Promise<T>, Y>;
      mockRejectedValue: (error: any) => Mock<Promise<T>, Y>;
      mockReturnValue: (value: T) => Mock<T, Y>;
      mockClear: () => void;
      mockReset: () => void;
      mockRestore: () => void;
    }

    function fn<T = any, Y extends any[] = any[]>(): Mock<T, Y>;
    function fn<T = any, Y extends any[] = any[]>(
      implementation: (...args: Y) => T,
    ): Mock<T, Y>;
    function spyOn(object: any, method: string): Mock;
    function clearAllMocks(): void;
    function resetAllMocks(): void;
    function restoreAllMocks(): void;
  }

  var ResizeObserver: jest.Mock;
}

// Jest testing types
declare namespace jest {
  interface Matchers<R> {
    toBeInTheDocument(): R;
    toHaveClass(className: string): R;
    toHaveTextContent(text: string): R;
  }
}

// Global types for testing
interface Window {
  CobrowseIO?: {
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
}

// Declare modules that don't have types
declare module '*.mp3' {
  const src: string;
  export default src;
}
