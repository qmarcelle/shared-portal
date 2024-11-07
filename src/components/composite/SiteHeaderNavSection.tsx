import Image from 'next/image';
import { useState } from 'react';
import { IComponent } from '../IComponent';
import { rightIcon, upIcon } from '../foundation/Icons';
import { SearchNavigation } from './SearchNavigation';
import { SiteHeaderSubNavProps } from './SiteHeaderSubNavSection';

export interface SiteHeaderNavProps extends IComponent {
  parentPages: SiteHeaderSubNavProps[];
  onOpenOverlay: (itemId: number) => void;
  activeSubNavId: number | null;
  closeMenuAndSubMenu: () => void;
}

export const SiteHeaderNavSection = ({
  parentPages,
  onOpenOverlay,
  activeSubNavId,
  closeMenuAndSubMenu,
}: SiteHeaderNavProps) => {
  const [currentPageId, setCurrentPageId] = useState<number>(0);
  return (
    <div className="flex flex-col w-full lg:flex-row border-b border-r lg:border-r-0">
      {parentPages.map((item, index) => (
        <div
          key={index}
          id={'accordion-collapse-heading-' + item.id}
          className="flex px-5 lg:px-1"
        >
          <div
            className={index == 0 ? 'w-full' : 'w-full border-t lg:border-0'}
          >
            <button
              type="button"
              className={`items-center px-0 lg:p-4 py-4 h-[56px] rounded-[4px] hover:bg-secondary-focus focus:outline-none focus:ring-2 focus:ring-primary box-border group ${currentPageId === item.id ? 'border-b-4 rounded-bl-none rounded-br-none border-primary' : ''} ${activeSubNavId === item.id ? 'active' : ''}`}
              data-accordion-target={'#accordion-collapse-body-' + item.id}
              aria-expanded="false"
              aria-controls={'accordion-collapse-body-' + item.id}
              onClick={() => {
                if (activeSubNavId === item.id) {
                  closeMenuAndSubMenu(); // Close overlay and submenu if it's open
                } else {
                  onOpenOverlay(item.id); // Open submenu
                  setCurrentPageId(item.id);
                }
              }}
            >
              <span className="flex lg:pr-2 primary-color">{item.title}</span>
              <Image
                className="block lg:hidden ml-auto"
                src={rightIcon}
                alt="Chevron icon"
              />
              <Image
                data-accordion-icon
                aria-expanded="false"
                className="hidden lg:block ml-auto rotate-180 group-hover:rotate-0 group-focus:rotate-0"
                src={upIcon}
                alt="Chevron icon"
              />
            </button>
          </div>
        </div>
      ))}
      <div className="order-first lg:order-last px-0 mx-0 lg:mx-auto lg:mr-0 lg:pl-5">
        <SearchNavigation></SearchNavigation>
      </div>
    </div>
  );
};
