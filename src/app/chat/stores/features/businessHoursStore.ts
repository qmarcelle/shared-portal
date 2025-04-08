import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BusinessHours } from '../models/types';

export interface BusinessHoursState {
  isWithinHours: boolean;
  currentSchedule: BusinessHours | null;
  timezone: string;
  lastCheck: number | null;
}

export interface BusinessHoursActions {
  checkBusinessHours: () => Promise<void>;
  setSchedule: (schedule: BusinessHours) => void;
  setTimezone: (timezone: string) => void;
  reset: () => void;
}

const initialState: BusinessHoursState = {
  isWithinHours: false,
  currentSchedule: null,
  timezone: 'America/New_York',
  lastCheck: null,
};

export const useBusinessHoursStore = create<
  BusinessHoursState & BusinessHoursActions
>()(
  devtools(
    (set) => ({
      ...initialState,

      checkBusinessHours: async () => {
        const now = new Date();
        set({ lastCheck: now.getTime() });

        // Business hours check implementation will go here
        // This is a placeholder that will need to be implemented
        // based on the actual business hours service
      },

      setSchedule: (schedule) =>
        set({
          currentSchedule: schedule,
          isWithinHours: schedule.isOpen24x7 || schedule.isCurrentlyOpen,
        }),

      setTimezone: (timezone) => set({ timezone }),

      reset: () => set(initialState),
    }),
    {
      name: 'business-hours-store',
    },
  ),
);
