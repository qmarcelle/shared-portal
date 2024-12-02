import { VisibilityRules } from '@/visibilityEngine/rules';

export interface SiteHeaderSubNavItem {
  title?: string;
  label?: string;
  icon: JSX.Element;
  url: string;
}

export interface ChildPages {
  id: number;
  title: string;
  description: string;
  category: string;
  showOnMenu: (rules: VisibilityRules | undefined) => boolean | undefined;
  url: string;
  external: boolean;
  childPages?: ChildPages[];
}

export interface ShortLinkNavItem {
  title: string;
  link: string;
}

export interface QuickTipNavItem {
  firstParagraph: string;
  secondParagraph: JSX.Element;
  link: string;
}
