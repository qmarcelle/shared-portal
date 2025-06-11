import { FilterItem } from '@/models/filter_dropdown_details';
import { DateFilterValues } from '@/utils/filterUtils';
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { MemberPriorAuthDetail } from '../models/priorAuthData';

interface PriorAuthState {
  selectedMember: string;
  selectedDateRange: `${DateFilterValues}`;
  filters: FilterItem[];
  selectedPriorAuth: MemberPriorAuthDetail | null;
  priorAuths: MemberPriorAuthDetail[];
  setPriorAuths: (priorAuths: MemberPriorAuthDetail[]) => void;
  setSelectedPriorAuth: (priorAuth: MemberPriorAuthDetail | null) => void;
  setSelectedMember: (member: string) => void;
  setSelectedDateRange: (dateRange: `${DateFilterValues}`) => void;
  setFilters: (filters: FilterItem[]) => void;
}

export const usePriorAuthStore = create<PriorAuthState>()(
  persist(
    (set) => ({
      selectedMember: '1',
      selectedDateRange: DateFilterValues.Last120Days,
      filters: [],
      selectedPriorAuth: null,
      priorAuths: [],
      setPriorAuths: (priorAuths: MemberPriorAuthDetail[]) =>
        set({ priorAuths: [...priorAuths] }),
      setSelectedPriorAuth: (priorAuth) =>
        set({ selectedPriorAuth: priorAuth }),
      setSelectedMember: (member) => set({ selectedMember: member }),
      setSelectedDateRange: (dateRange) =>
        set({ selectedDateRange: dateRange }),
      setFilters: (filters) => set({ filters }),
    }),
    {
      name: 'prior-auth-store', // name of the storage key
    },
  ),
);
