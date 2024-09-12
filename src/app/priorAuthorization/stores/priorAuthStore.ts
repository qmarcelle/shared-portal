import { logger } from '@/utils/logger';
import { AxiosError } from 'axios';
import { create } from 'zustand';
import { invokeSortData } from '../actions/authStore';
type Store = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  execute: () => void;
};

const usePriorAuthStore = create<Store>((set) => ({
  execute: async () => {
    try {
      const res = await invokeSortData();
      set({
        data: res,
      });
      return res;
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.error('Response from API ' + error.response?.data);
        return {
          errorCode:
            error.response?.data?.data?.errorCode ??
            error.response?.data?.details?.returnCode,
        };
      } else {
        throw 'An error occured';
      }
    }
  },
}));

export default usePriorAuthStore;
