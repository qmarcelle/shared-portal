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
}

export const SiteHeaderSubNavSection = ({
  id,
  title,
  url,
  qt,
  template,
  shortLinks,
  childPages,
}: SiteHeaderSubNavProps) => {
  return (
    <div
      id={'accordion-collapse-body-' + id}
      className="hidden border-b grid p-5 grid-cols-4 gap-1 font-bold"
      aria-labelledby={'accordion-collapse-heading-' + id}
    >
      <button
        type="button"
        className="lg:hidden items-center p-0 mb-4"
        data-accordion-target={'#accordion-collapse-body-' + id}
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
        <Link className="flex text-3xl" href={url}>
          <span className="underline pr-2">{title}</span>
          <Image
            width="36"
            height="36"
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
        />
      </div>
      <div className="col-start-1 col-end-5 lg:col-start-2 lg:col-end-3 py-4 border-b lg:border-0">
        <SubNavItemSection
          colType={template.secondCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
        />
      </div>
      <div className="col-start-1 col-end-5 lg:col-start-3 lg:col-end-4 py-4 border-b lg:border-0">
        <SubNavItemSection
          colType={template.thirdCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
        />
      </div>
      <div className="col-start-1 col-end-5 lg:col-start-4 lg:col-end-5 py-4">
        <SubNavItemSection
          colType={template.fourthCol}
          url={url}
          qt={qt}
          shortLinks={shortLinks}
          childPages={childPages}
        />
      </div>
    </div>
  );
};
