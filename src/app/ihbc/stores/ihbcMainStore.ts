import { isDateInRange } from '@/utils/date_range_utils';
import { createWithEqualityFn } from 'zustand/traditional';
import { getApplicationListForSubscriber } from '../actions/getApplications';
import { OpenAppInfoBean } from '../models/OpenAppInfoBean';

type State = {
  applications: OpenAppInfoBean[];
  isOEActive: boolean;
};

type Actions = {
  loadApplications: () => void;
};

const initialState: State = {
  applications: [],
  isOEActive: isDateInRange(
    process.env.NEXT_PUBLIC_OE_START,
    process.env.NEXT_PUBLIC_OE_END,
  ),
};

export const useIhbcMainStore = createWithEqualityFn<State & Actions>(
  (set, get) => ({
    ...initialState,
    loadApplications: async () => {
      const applications = await getApplicationListForSubscriber();
      set({
        applications: applications,
      });
    },
  }),
);
