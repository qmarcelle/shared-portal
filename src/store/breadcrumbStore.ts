import { getBreadcrumbTrail } from '@/actions/breadcrumbs';
import { Breadcrumb } from '@/models/app/breadcrumb';
import { create } from 'zustand';

interface BreadcrumbStore {
  breadcrumbs: Breadcrumb[];
  dynamicText?: string;
  updateBreadcrumbs: (path: string) => Promise<void>;
  setDynamicBreadcrumbText: (text: string) => void;
}

export const useBreadcrumbStore = create<BreadcrumbStore>((set, get) => ({
  breadcrumbs: [],
  dynamicText: undefined,
  updateBreadcrumbs: async (path: string) => {
    const newBreadcrumbTrail = await getBreadcrumbTrail(
      path,
      get().dynamicText,
    );
    set({
      breadcrumbs: newBreadcrumbTrail,
    });
  },
  setDynamicBreadcrumbText: (text: string) =>
    set({
      dynamicText: text,
    }),
}));
