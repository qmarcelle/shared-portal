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
import { IComponent } from '../IComponent';

export interface SiteHeaderSubNavItemProps extends IComponent {
  colType: string;
  url: string;
  qt?: QuickTipNavItem;
  shortLinks?: ShortLinkNavItem[];
  childPages: ChildPages[];
}

export const SubNavItemSection = ({
  colType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url,
  qt,
  shortLinks,
  childPages,
}: SiteHeaderSubNavItemProps) => {
  const tempChildPages: ChildPages[] = [];
  const router = useRouter();

  childPages.map((item) => {
    if (colType == item.category) tempChildPages.push(item);
  });

  function ChangeUrl(link: string) {
    router.replace(link);
  }

  return (
    <div className="lg:grid-rows-4">
      {(() => {
        if (colType == 'QT') {
          return (
            <a href={qt?.link}>
              <div className="row-span-4 font-normal text-gray-500 lg:w-3/4 secondary-bg-color1-accent p-5 rounded-lg">
                <h3 className="pb-3 text-sm">Quick Tip</h3>
                <p className="pb-1">{qt?.firstParagraph}</p>
                {qt?.secondParagraph}
                <Image
                  className="ml-auto"
                  src={parentPageArrowIcon}
                  alt="Page Arrow"
                ></Image>
              </div>
            </a>
          );
        } else if (colType == 'LINKS') {
          return shortLinks?.map((item, index) => (
            <a key={index} href={item.link}>
              <div className="flex row-span-1 p-2 mb-2 secondary-bg-color1-accent rounded-lg">
                <h3 className="p-2">{item.title}</h3>
                <Image
                  className="ml-auto"
                  src={parentPageArrowIcon}
                  alt="Page Arrow"
                />
              </div>
            </a>
          ));
        } else if (colType.length != 0) {
          return (
            <>
              {colType !== 'Support' && (
                <h1 className="text-xl py-2 text-gray-500">{colType}</h1>
              )}
              {tempChildPages.map((item, index) =>
                item.external ? (
                  <Link
                    key={index}
                    className="flex"
                    href={item.url}
                    target="_blank"
                  >
                    <p className="pb-2 pt-2 pr-1">{item.title}</p>
                    <Image
                      className="pb-2"
                      src={externalIcon}
                      alt="External Link"
                    />
                  </Link>
                ) : (
                  <AppLink
                    key={index}
                    label={item.title}
                    callback={() => ChangeUrl(item.url)}
                    className="pb-2 pt-2 manage-underline"
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
