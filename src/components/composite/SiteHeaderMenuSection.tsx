import { AnalyticsData } from '@/models/app/analyticsData';
import { UserProfile } from '@/models/user_profile';
import { googleAnalytics } from '@/utils/analytics';
import Link from 'next/link';
import { SectionHeaderMenuItem } from '../../models/section_header_menu_item';
import { IComponent } from '../IComponent';
import ProfileHeaderCard from './ProfileHeaderCard';

export interface SiteHeaderMenuProps extends IComponent {
  icon: JSX.Element;
  items: SectionHeaderMenuItem[];
  profiles: UserProfile[];
}

export const SiteHeaderMenuSection = ({
  icon,
  items,
  profiles,
}: SiteHeaderMenuProps) => {
  function trackIdCardLinkAnalytics(clickText: string, clickUrl: string): void {
    const analytics: AnalyticsData = {
      event: 'internal_link_click',
      click_text: clickText,
      click_url: clickUrl,
      page_section: undefined,
      element_category: undefined,
    };
    googleAnalytics(analytics);
  }

  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <Link
          key={index}
          className="flex mr-5 items-center justify-center font-bold hover:bg-secondary-focus h-[40px] w-[40px] sm:h-[56px] sm:w-[102px] lg:h-[56px] lg:w-[134px] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary-color  box-border"
          href={item.url}
          onClick={
            item.label === 'id card'
              ? () => trackIdCardLinkAnalytics('ID Card', '/member/idcard')
              : undefined
          }
        >
          {item.icon}
          <span className="hidden lg:inline px-2 pt-2">{item.title}</span>
        </Link>
      ))}
      <ProfileHeaderCard icon={icon} profiles={profiles} />
    </div>
  );
};
