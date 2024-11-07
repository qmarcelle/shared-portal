import { SectionHeaderMenuItem } from '../../models/section_header_menu_item';
import { IComponent } from '../IComponent';
import ProfileHeaderCard from './ProfileHeaderCard';

export interface SiteHeaderMenuProps extends IComponent {
  user: string;
  icon: JSX.Element;
  items: SectionHeaderMenuItem[];
}

export const SiteHeaderMenuSection = ({
  user,
  icon,
  items,
}: SiteHeaderMenuProps) => {
  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <a
          key={index}
          className="flex mr-5 items-center justify-center font-bold hover:bg-secondary-focus h-[40px] w-[40px] sm:h-[56px] sm:w-[102px] lg:h-[56px] lg:w-[134px] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-primary-color  box-border"
          href={item.url}
        >
          {item.icon}
          <span className="hidden lg:inline px-2 pt-2">{item.title}</span>
        </a>
      ))}
      <ProfileHeaderCard user={user} icon={icon} />
    </div>
  );
};
