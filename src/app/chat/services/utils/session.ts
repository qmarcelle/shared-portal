/**
 * Session Management Utility Functions
 * Functions for handling chat sessions
 */

/**
 * Generate a unique interaction ID for chat sessions
 * Format: MP-{timestamp}-{random}
 * Used to track chat sessions across the system
 */
export function generateInteractionId(): string {
  return `MP-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
