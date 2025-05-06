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
  apiErrors: string[];
};

export const usePrimaryAccountSelectionStore =
  createWithEqualityFn<PrimaryAccountSelectionStore>(
    (set) => ({
      apiErrors: [],
      resetApiErrors: () =>
        set(() => ({
          apiErrors: [],
        })),
      continueWithUsernameProg: AppProg.init,
      submitPrimaryAccountSelection: async (e?: FormEvent<HTMLFormElement>) => {
        logger.info(
          '[primaryAccountSelectionStore] ENTRY submitPrimaryAccountSelection',
          { userId: useLoginStore.getState().userId },
        );
        try {
          e?.preventDefault();
          set({ apiErrors: [] });
          set({
            continueWithUsernameProg: AppProg.loading,
          });
          logger.info(
            '[primaryAccountSelectionStore] Calling getPersonBusinessEntity',
            { userId: useLoginStore.getState().userId },
          );
          const pbe = await getPersonBusinessEntity(
            useLoginStore.getState().userId,
          );
          logger.info('[primaryAccountSelectionStore] PBE fetched', {
            userName: pbe.getPBEDetails[0]?.userName,
            umpid: pbe.getPBEDetails[0]?.umpid,
          });
          const resp = await callAccountDeactivation({
            primaryUserName: pbe.getPBEDetails[0].userName,
            umpiId: pbe.getPBEDetails[0].umpid,
            userName: useLoginStore.getState().username,
          });
          logger.info(
            '[primaryAccountSelectionStore] callAccountDeactivation response',
            { resp },
          );
          if (resp) useLoginStore.getState().updateLoggedUser(true);
          set({
            continueWithUsernameProg: AppProg.success,
          });
          logger.info('[primaryAccountSelectionStore] EXIT success');
        } catch (err) {
          logger.error('[primaryAccountSelectionStore] ERROR', { err });
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
