import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChildPages,
  QuickTipNavItem,
  ShortLinkNavItem,
} from '../../models/site_header_sub_nav_item';
import { IComponent } from '../IComponent';
import { parentPageArrowIcon } from '../foundation/Icons';
import { SubNavItemSection } from './SiteHeaderSubNavItemSection';

export interface SiteHeaderSubNavProps extends IComponent {
  id: number;
  title: string;
  description: string;
  category: string;
  showOnMenu: boolean;
  url: string;
  qt?: QuickTipNavItem;
  template: {
    firstCol: string;
    secondCol: string;
    thirdCol: string;
    fourthCol: string;
  };
  shortLinks?: ShortLinkNavItem[];
  childPages: ChildPages[];
  activeSubNavId: number | null;
  closeSubMenu: () => void;
  visibilityRules?: VisibilityRules;
}

export const SiteHeaderSubNavSection = ({
  id,
  title,
  url,
  qt,
  template,
  shortLinks,
  childPages,
  activeSubNavId,
  closeSubMenu,
  visibilityRules,
}: SiteHeaderSubNavProps) => {
   const  trackAnalytics=(title: string, url: string)=>{
      const analytics: AnalyticsData = {
        event: 'navigation',
        click_text: title.toLowerCase(),
        click_url: url,     
        page_section: 'header',
        nav_section: 'header'
      };
      googleAnalytics(analytics);
    }
  return (
    <div
      id={'accordion-collapse-body-' + id}
      className={`${
        activeSubNavId === id ? 'block' : 'hidden' // Show submenu only if activeSubNavId matches the current id
      } border-b grid p-5 grid-cols-4 gap-1 font-bold`}
      aria-labelledby={'accordion-collapse-heading-' + id}
    >
      <button
        type="button"
        className="lg:hidden items-center p-0 mb-4"
        data-accordion-target={'#accordion-collapse-body-' + id}
        onClick={closeSubMenu}
      >
        <svg
          data-accordion-icon
          className="w-4 h-4 rotate-270 shrink-0 primary-color"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            strokeLinejoin="round"
            stroke-width="1"
            d="M9 5 5 1 1 5"
          />
        </svg>
        <span className="primary-color underline pl-1">Back</span>
      </button>
      <div className="pb-5 border-b col-start-1 col-end-5 ...">
        <Link
          className="flex text-2xl w-max focus:outline-none focus:text-primary focus:rounded focus-visible:ring-2 focus-visible:ring-primary focus:ring-2 focus:ring-primary box-border underline-offset-4 focus:p-1 focus-visible:p-1"
          href={url}
          onClick={()=> trackAnalytics(title,url)}
        >
          <span className="underline underline-offset-4 hover:no-underline hover:text-primary-focus focus:no-underline pr-2">
            {title}
          </span>
          <Image
            width="32"
            height="32"
            src={parentPageArrowIcon}
            alt="Parent Page Arrow"
          ></Image>
          
        </Link>
      </div>

      <div className="col-start-1 col-end-5 lg:col-start-1 lg:col-end-2 py-4 border-b lg:border-0">
        <SubNavItemSection
          colType={template.firstCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
          visibilityRules={visibilityRules}
          closeSubMenu={closeSubMenu}
        />
      </div>
      <div className="col-start-1 col-end-5 lg:col-start-2 lg:col-end-3 py-4 border-b lg:border-0">
        <SubNavItemSection
          colType={template.secondCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
          visibilityRules={visibilityRules}
          closeSubMenu={closeSubMenu}
        />
      </div>
      <div className="col-start-1 col-end-5 lg:col-start-3 lg:col-end-4 py-4 border-b lg:border-0">
        <SubNavItemSection
          colType={template.thirdCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
          visibilityRules={visibilityRules}
          closeSubMenu={closeSubMenu}
        />
      </div>
      <div className="col-start-1 col-end-5 lg:col-start-4 lg:col-end-5 py-4">
        <SubNavItemSection
          colType={template.fourthCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
          visibilityRules={visibilityRules}
          closeSubMenu={closeSubMenu}
        />
      </div>
    </div>
  );
};
