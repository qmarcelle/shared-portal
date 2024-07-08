import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { ProfileHeaderCardItem } from '../composite/ProfileHeaderCardItem';
import { useSideBarModalStore } from '../foundation/SideBarModal';
import { Button } from '../foundation/Button';

export const ProfileHeaderCard = () => {
  const { showSideBar } = useSideBarModalStore();
  return (
    <Column className="app-content app-base-font-color card-end">
      <section className="flex flex-row items-start app-body">
        <Column className="flex-grow page-section-36_67 items-stretch">
          <TextBox text="" />
        </Column>
        <Column>
          <Button
            label="Open Side bar"
            callback={() =>
              showSideBar({
                content: (
                  <ProfileHeaderCardItem
                    profileSetting="All Profile Settings"
                    communicationSetting="Communication Settings"
                    securitySetting="Security Settings"
                    sharingAndPermissions="Sharing & Permissions"
                    profiles={[
                      {
                        id: '456',
                        name: 'Chris Hall',
                        dob: '11/03/2000',
                        type: 'Primary',
                      },
                      {
                        id: '457',
                        name: 'Chris Hall',
                        dob: '11/03/2000',
                        type: 'Primary',
                      },
                    ]}
                  />
                ),
              })
            }
          />
        </Column>
      </section>
    </Column>
  );
};

export default ProfileHeaderCard;
