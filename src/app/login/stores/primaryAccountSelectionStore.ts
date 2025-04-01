import { AppProg } from '@/models/app_prog';
import { getPersonBusinessEntity } from '@/utils/api/client/get_pbe';
import { logger } from '@/utils/logger';
import { FormEvent } from 'react';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import { callAccountDeactivation } from '../actions/accountDeactivation';
import { useLoginStore } from './loginStore';

type PrimaryAccountSelectionStore = {
  submitPrimaryAccountSelection: (e?: FormEvent<HTMLFormElement>) => void;
  resetApiErrors: () => void;
  continueWithUsernameProg: AppProg;
  pbeError: boolean;
  apiErrors: string[];
};

export const usePrimaryAccountSelectionStore =
  createWithEqualityFn<PrimaryAccountSelectionStore>(
    (set) => ({
      apiErrors: [],
      pbeError: false,
      resetApiErrors: () =>
        set(() => ({
          apiErrors: [],
        })),
      continueWithUsernameProg: AppProg.init,
      submitPrimaryAccountSelection: async (e?: FormEvent<HTMLFormElement>) => {
        try {
          e?.preventDefault();

          set({ apiErrors: [] });
          set({
            continueWithUsernameProg: AppProg.loading,
          });
          let pbe;
          try {
            pbe = await getPersonBusinessEntity(
              useLoginStore.getState().username,
            );
          } catch (err) {
            logger.error('Error from getPBE in Primary Account selection', err);
            set({ pbeError: true });
            return;
          }
          const resp = await callAccountDeactivation({
            primaryUserName: pbe?.getPBEDetails[0].userName,
            umpiId: pbe?.getPBEDetails[0].umpid,
            userName: useLoginStore.getState().username,
          });
          if (resp) useLoginStore.getState().updateLoggedUser(true);
          set({
            continueWithUsernameProg: AppProg.success,
          });
        } catch (err) {
          logger.error('Error from accountDeactivation Api', err);
        } finally {
          useLoginStore.getState().updateLoggedUser(true);
          set({
            continueWithUsernameProg: AppProg.success,
          });
        }
      },
    }),
    shallow,
  );
