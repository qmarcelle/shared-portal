// lib/utils/serviceResult.ts
/**
 * Standardized result object for service operations
 */
export class ServiceResult<T> {
  private constructor(
    readonly success: boolean,
    readonly data?: T,
    readonly error?: Error,
    readonly metadata?: Record<string, any>
  ) {}
  
  /**
   * Create a successful result with data
   */
  static success<T>(data: T, metadata?: Record<string, any>): ServiceResult<T> {
    return new ServiceResult(true, data, undefined, metadata);
  }
  
  /**
   * Create a failure result with error information
   */
  static failure<T>(message: string, originalError?: any, metadata?: Record<string, any>): ServiceResult<T> {
    let error: Error;
    
    if (originalError instanceof Error) {
      error = originalError;
    } else {
      error = new Error(message);
      if (originalError) {
        (error as any).originalError = originalError;
      }
    }
    
    return new ServiceResult(false, undefined, error, metadata);
  }
}

// lib/utils/apiResponse.ts
/**
 * Standardized API response format for server actions
 */
export class ApiResponse<T> {
  constructor(
    readonly success: boolean,
    readonly data?: T,
    readonly error?: string,
    readonly statusCode?: number,
    readonly validationErrors?: Record<string, string[]>
  ) {}
  
  /**
   * Create a successful API response
   */
  static success<T>(data: T): ApiResponse<T> {
    return new ApiResponse(true, data);
  }
  
  /**
   * Create an error API response
   */
  static error<T>(
    message: string,
    statusCode = 500,
    validationErrors?: Record<string, string[]>
  ): ApiResponse<T> {
    return new ApiResponse(false, undefined, message, statusCode, validationErrors);
  }
}

// lib/utils/caching.ts
import { Redis } from '@upstash/redis';
import { env } from '@/lib/config/env';

// Initialize Redis client if configured
const redisClient = env.REDIS_URL ? new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN,
}) : null;

/**
 * Cache utility for service results
 */
export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!redisClient) {
      return null;
    }
    
    try {
      return await redisClient.get(key);
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },
  
  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (!redisClient) {
      return;
    }
    
    try {
      await redisClient.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  },
  
  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    if (!redisClient) {
      return;
    }
    
    try {
      await redisClient.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }
};

// lib/utils/logging.ts
import pino from 'pino';
import { env } from '@/lib/config/env';

/**
 * Application logger
 */
export const logger = pino({
  level: env.LOG_LEVEL || 'info',
  transport: env.NODE_ENV !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  } : undefined,
  redact: {
    paths: [
      'password',
      'passwordConfirmation',
      'secret',
      'token',
      '*.password',
      '*.passwordConfirmation',
      '*.secret',
      '*.token',
    ],
    remove: true
  }
});
