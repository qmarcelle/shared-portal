import { useGroup } from '@/app/providers/GroupProvider';
import { IComponent } from '../IComponent';
import { Column } from '../foundation/Column';
import { SiteHeaderMenuSection } from './SiteHeaderMenuSection';
import { SiteHeaderNavSection } from './SiteHeaderNavSection';

export interface HeaderProps extends IComponent {}

export function Header({ className }: HeaderProps) {
  const { group } = useGroup();

  return (
    <header className={`w-full bg-white shadow-md ${className ?? ''}`}>
      <Column className="app-content py-4">
        <div className="flex justify-between items-center">
          <SiteHeaderNavSection
            parentPages={[]}
            onOpenOverlay={() => {}}
            activeSubNavId={null}
            closeMenuAndSubMenu={() => {}}
          />
          <SiteHeaderMenuSection icon={<></>} items={[]} profiles={[]} />
        </div>
      </Column>
    </header>
  );
}
