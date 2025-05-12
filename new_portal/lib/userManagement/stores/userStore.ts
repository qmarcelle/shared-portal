import { create } from 'zustand';
import { MemberUser } from '../models/user';

type UserStore = {
  users: MemberUser[];
  selectedId: string;
  setSelectedId: (userId: string) => void;
  setUsers: (users: MemberUser[]) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  selectedId: '',
  setSelectedId: (userId) => set({ selectedId: userId }),
  setUsers: (users) => set({ users }),
}));