import { create } from 'zustand';
import { login as loginAction } from '../actions/login';
import { getPingOneData } from '../../../(protected)/amplify/member/pingOne/setupPingOne';
import { AppProg } from '../models/app_prog';

interface LoginState {
  username: string;
  password: string;
  loginProg: AppProg;
  apiErrors: string[];
  updateUsername: (val: string) => void;
  updatePassword: (val: string) => void;
  login: () => Promise<void>;
  resetApiErrors: () => void;
}

export const useLoginStore = create<LoginState>((set, get) => ({
  username: '',
  password: '',
  loginProg: AppProg.init,
  apiErrors: [],

  updateUsername: (val) => set({ username: val }),
  updatePassword: (val) => set({ password: val }),
  
  login: async () => {
    try {
      set({ loginProg: AppProg.loading, apiErrors: [] });
      const state = get();
      const pingOneData = await getPingOneData();
      
      const response = await loginAction({
        username: state.username,
        password: state.password,
        pingOneData: pingOneData ?? undefined,
      });

      if (response?.success) {
        set({ loginProg: AppProg.success });
        // Navigate or handle successful login
      } else {
        set({
          loginProg: AppProg.failed,
          apiErrors: response?.errors || ['An unknown error occurred'],
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      set({
        loginProg: AppProg.failed,
        apiErrors: ['An unexpected error occurred. Please try again.'],
      });
    }
  },

  resetApiErrors: () => set({ apiErrors: [] }),
}));