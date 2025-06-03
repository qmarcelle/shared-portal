import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChildPages,
  QuickTipNavItem,
  ShortLinkNavItem,
} from '../../models/site_header_sub_nav_item';
import { AppLink } from '../foundation/AppLink';
import { externalIcon, parentPageArrowIcon } from '../foundation/Icons';
import { TextBox } from '../foundation/TextBox';
import { IComponent } from '../IComponent';

export interface SiteHeaderSubNavItemProps extends IComponent {
  colType: string;
  url: string;
  qt?: QuickTipNavItem;
  shortLinks?: ShortLinkNavItem[];
  childPages: ChildPages[];
  visibilityRules?: VisibilityRules;
  closeSubMenu: () => void;
}

export const SubNavItemSection = ({
  colType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url,
  qt,
  shortLinks,
  childPages,
  visibilityRules,
  closeSubMenu,
}: SiteHeaderSubNavItemProps) => {
  const tempChildPages: ChildPages[] = [];
  const router = useRouter();

  childPages.map((item) => {
    if (colType == item.category && item.showOnMenu(visibilityRules))
      tempChildPages.push(item);
  });

  function ChangeUrl(link: string, title: string) {
    const analytics: AnalyticsData = {
      event: 'navigation',
      click_text: title.toLowerCase(),
      click_url: url,
      page_section: 'header',
      nav_section: 'header',
    };
    googleAnalytics(analytics);
    router.push(link);
    closeSubMenu();
  }

  return (
    <div className="lg:grid-rows-4">
      {(() => {
        if (colType == 'QT') {
          return (
            <Link href={qt?.link ?? ''} onClick={closeSubMenu}>
              <div className="row-span-4 font-normal text-gray-500 lg:w-[256px] secondary-bg-color1-accent p-5 rounded-lg">
                <h3 className="pb-3 text-sm text-black">Quick Tip</h3>
                <p className="pb-1 text-base app-base-font-color ">
                  {qt?.firstParagraph}
                </p>
                {qt?.secondParagraph}
                <Image
                  className="ml-auto"
                  src={parentPageArrowIcon}
                  alt=""
                ></Image>
              </div>
            </Link>
          );
        } else if (colType == 'LINKS') {
          return shortLinks?.map((item, index) => (
            <a key={index} href={item.link}>
              <div className="flex row-span-1 p-2 mb-2 secondary-bg-color1-accent rounded-lg">
                <h3 className="p-2">{item.title}</h3>
                <Image className="ml-auto" src={parentPageArrowIcon} alt="" />
              </div>
            </a>
          ));
        } else if (colType.length != 0) {
          return (
            <>
              {colType !== 'Support' && !!tempChildPages.length && (
                <TextBox
                  text={colType}
                  className="title-1 py-2 tertiary-color font-thin !text-2xl"
                />
              )}
              {tempChildPages.map((item, index) =>
                item.external ? (
                  <Link
                    key={index}
                    className="flex w-max focus:outline-none focus:rounded focus-visible:ring-2 focus-visible:ring-primary focus:ring-2 focus:ring-primary box-border underline-offset-4 hover:underline focus:underline"
                    href={item.url}
                    target={item.openInNewWindow ? '_blank' : ''}
                  >
                    <p className="pb-2 pt-2 pr-1 focus-visible:py-0 focus:py-0 primary-color hover:text-primary-focus">
                      {item.title}
                    </p>
                    <Image className="pb-2" src={externalIcon} alt="" />
                  </Link>
                ) : (
                  <AppLink
                    key={index}
                    label={item.title}
                    callback={() => ChangeUrl(item.url, item.title)}
                    className="pl-0 underline-offset-4 manage-underline flex hover:primary-focus focus:p-1 w-max hover:underline focus:rounded focus:underline focus:ring-2 focus:ring-primary box-border"
                  />
                ),
              )}
            </>
          );
        } else {
        }
      })()}
    </div>
  );
};
