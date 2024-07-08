import { ChildPages } from './site_header_sub_nav_item';

export interface SiteHeaderNavItem {
  id: number;
  title: string;
  description: string;
  category: string;
  showOnMenu: boolean;
  url: string;
  external: boolean;
  childPages?: ChildPages[];
}
