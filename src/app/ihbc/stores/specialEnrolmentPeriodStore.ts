import { createWithEqualityFn } from 'zustand/traditional';
import { SpecialEnrolmentEventEnum } from '../models/SpecialEnrolmentEventEnum';
import { computeSepEffectiveDates } from '../rules/sepEffectiveDates';

export type SpecialEnrolmentEventState = {
  event: SpecialEnrolmentEventEnum | null; // Event of enrolment
  eventDate: string | undefined; // Date when event occurred
  effectiveDates: string[]; // Dates which are computed to be allowed effective dates
  selectedEffectiveDate: string | undefined; // Effective date selected by user
};

export type SpecialEnrolmentEventAction = {
  updateEvent: (event: SpecialEnrolmentEventEnum) => void;
  updateEventDate: (event: string) => void;
  updateSelectedEffectiveDate: (date: string) => void;
};

const initialState: SpecialEnrolmentEventState = {
  event: null,
  eventDate: undefined,
  effectiveDates: [],
  selectedEffectiveDate: undefined,
};

export const useSpecialEnrolmentPeriodStore = createWithEqualityFn<
  SpecialEnrolmentEventState & SpecialEnrolmentEventAction
>((set, get) => ({
  ...initialState,
  updateEvent: (event) => {
    set(initialState);
    set({ event: event });
  },
  updateEventDate: (eventDate) => {
    set({ eventDate: eventDate });
    set({
      effectiveDates: [
        ...new Set(computeSepEffectiveDates(get().event!, eventDate)),
      ],
    });
  },
  updateSelectedEffectiveDate: (date: string) => {
    set({ selectedEffectiveDate: date });
  },
}));
