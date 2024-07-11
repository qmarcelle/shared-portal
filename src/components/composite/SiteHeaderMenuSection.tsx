import { SectionHeaderMenuItem } from '../../models/section_header_menu_item';
import { IComponent } from '../IComponent';

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
      <div className="flex h-full secondary-bg-color2 text-white px-4 py-1">
        {icon}
        <div className="hidden lg:block p-2">
          <span className="text-xs">Primary Profile</span>
          <p>{user}</p>
        </div>
      </div>
    </div>
  );
};
