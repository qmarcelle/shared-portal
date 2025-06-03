import { SiteHeaderMenuSection } from '@/components/composite/SiteHeaderMenuSection';
import {
  globalIdCardIcon,
  profileWhiteIcon,
} from '@/components/foundation/Icons';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';

const mockUserProfiles: UserProfile[] = [
  {
    dob: '08/07/2002',
    firstName: 'Chris',
    lastName: 'Hall',
    id: '76547r664',
    personFhirId: '787655434',
    selected: true,
    type: UserRole.MEMBER,
    plans: [
      {
        memCK: '65765434',
        patientFhirId: '656543456',
        selected: true,
      },
    ],
  },
];

const renderUI = () => {
  return render(
    <div>
      <SiteHeaderMenuSection
        profiles={mockUserProfiles}
        icon={<Image src={profileWhiteIcon} alt="Profile Icon"></Image>}
        items={[
          {
            title: 'ID Card',
            label: 'id card',
            icon: <Image src={globalIdCardIcon} alt="ID Card" />,
            url: '/member/idcard',
          },
        ]}
      />
    </div>,
  );
};

describe('SiteHeader Menu -  ID Card', () => {
  beforeEach(() => {
    window.dataLayer = [];
  });

  it('Google Analtics  - Header ID Card ', async () => {
    const component = renderUI();
    const idCardIcon = screen.getByAltText('ID Card');
    fireEvent.click(idCardIcon);
    expect(window.dataLayer).toContainEqual({
      event: 'internal_link_click',
      click_text: 'ID Card',
      click_url: '/member/idcard',
      page_section: undefined,
      element_category: undefined,
    });
    expect(component.baseElement).toMatchSnapshot();
  });
});
