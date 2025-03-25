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
        <a key={index} className="flex mr-5 font-bold" href={item.url}>
          {item.icon}
          <span className="hidden lg:inline px-2 pt-2">{item.title}</span>
        </a>
      ))}
      <ProfileHeaderCard user={user} icon={icon} />
    </div>
  );
};
