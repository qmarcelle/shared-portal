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
  showOnMenu: boolean;
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
  secondParagraph: string;
  link: string;
}
