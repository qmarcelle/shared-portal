/**
 * Type definitions for chat models
 * Note: This file is maintained for backward compatibility.
 * New code should use schemas/user.ts for type definitions.
 */

import {
  BusinessHours as SchemaBusinessHours,
  ChatDataPayload as SchemaPayload,
} from '../schemas/user';

// Re-export types from the new schema file
export type BusinessHours = SchemaBusinessHours;
export type ChatPayload = SchemaPayload;

// Define any additional backward-compatible types as needed
export interface BusinessDay {
  day: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}
