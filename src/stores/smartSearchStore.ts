import { invokeSmartSearch } from '@/actions/smartSearch';
import { SearchDetails } from '@/models/app/searchDetails';
import { SmartSearchRequest } from '@/models/enterprise/smartSearch';
import { logger } from '@/utils/logger';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export type SmartSearchStore = {
  getSmartSearch: () => void;
  updateSearchText: (searchTerm: string) => void;
  searchResults: SearchDetails[];
  showError: boolean;
  searchText: string;
};

export const useSmartSearchStore = createWithEqualityFn<SmartSearchStore>(
  (set, get) => ({
    searchResults: [],
    showError: false,
    searchText: '',
    getSmartSearch: async () => {
      try {
        // To DO Need to set searchResults as empty array once we integrate with api
        set(() => ({
          searchResults: [
            {
              header: 'Benefits',
              content: [
                'Teladoc health general medical',
                'Teladoc health mental healthcare',
                'Teladoc Health myStrength (digital content/coaching)',
              ],
            },
            {
              header: 'Find Care',
              content: ['Telahealth Providers'],
            },
            {
              header: 'Claims',
              content: [''],
            },
          ],
        }));
        set(() => ({ showError: false }));
        const request: SmartSearchRequest = {
          searchTerm: get().searchText,
        };
        const resp = await invokeSmartSearch(request);
        if (resp.errorCode) {
          throw resp;
        }
        if (resp.data?.suggestionResponse) {
          const searchDetails: SearchDetails[] = [];
          searchDetails.push({
            header: resp.data?.suggestionResponse,
            content: [resp.data?.suggestionResponse],
          });
          set(() => ({ searchResults: searchDetails }));
        }
      } catch (error) {
        // Log the error
        logger.error('Error from Login Api', error);
        set(() => ({ showError: true }));
        // To DO Need to set searchResults as empty array once we integrate with api
        set(() => ({
          searchResults: [
            {
              header: 'Benefits',
              content: [
                'Teladoc health general medical',
                'Teladoc health mental healthcare',
                'Teladoc Health myStrength (digital content/coaching)',
              ],
            },
            {
              header: 'Find Care',
              content: ['Telahealth Providers'],
            },
            {
              header: 'Claims',
              content: [''],
            },
          ],
        }));
      }
    },
    updateSearchText: (searchTerm: string) => {
      set(() => ({ searchText: searchTerm }));
    },
  }),
  shallow,
);
