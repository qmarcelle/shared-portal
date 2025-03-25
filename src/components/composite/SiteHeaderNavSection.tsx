import Image from 'next/image';
import { IComponent } from '../IComponent';
import { rightIcon, searchIcon, upIcon } from '../foundation/Icons';
import { SiteHeaderSubNavProps } from './SiteHeaderSubNavSection';

export interface SiteHeaderNavProps extends IComponent {
  parentPages: SiteHeaderSubNavProps[];
}

export const SiteHeaderNavSection = ({ parentPages }: SiteHeaderNavProps) => {
  return (
    <div className="flex flex-col w-full lg:flex-row border-b border-r lg:border-r-0">
      {parentPages.map((item, index) => (
        <div
          key={index}
          id={'accordion-collapse-heading-' + item.id}
          className="flex px-5 lg:pr-0"
        >
          <div
            className={index == 0 ? 'w-full' : 'w-full border-t lg:border-0'}
          >
            <button
              type="button"
              className="items-center px-0 lg:pr-1 py-4"
              data-accordion-target={'#accordion-collapse-body-' + item.id}
              aria-expanded="false"
              aria-controls={'accordion-collapse-body-' + item.id}
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
                className="hidden lg:block rotate-180"
                src={upIcon}
                alt="Chevron icon"
              />
            </button>
          </div>
        </div>
      ))}
      <div className="order-first lg:order-last px-5 mx-auto lg:ml-auto lg:mr-0">
        <button
          type="button"
          className="items-center content-center lg:pr-0 py-4"
        >
          <span className="px-2">Search</span>
          <Image src={searchIcon} alt="Search" />
        </button>
      </div>
    </div>
  );
};
