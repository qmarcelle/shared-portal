import { createWithEqualityFn } from 'zustand/traditional';
import { MemberUser } from '../models/user';

//TODO: Sample Store created to be implemented when we do user switching
type UserStore = {
  users: MemberUser[];
  selectedId: string;
  setSelectedId: (userId: string) => void;
};

export const useUserStore = createWithEqualityFn<UserStore>((set, get) => ({
  users: [],
  selectedId: '',
  setSelectedId: (userId) => {},
}));
