'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { AboutSocialSecurityNumberCard } from './components/AboutSocialSecurityNumberCard';
import { MemberListCard } from './components/MemberListCard';

const UpdateSocialSecurityNumber = () => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header
          type="title-1"
          className="font-bold"
          text="Update Social Security Number"
        />
        <Spacer size={16} />
        <TextBox
          text="You can update the Social Security Number (SSN) we have on file here."
          ariaLabel="You can update the Social Security Number (SSN) we have on file here."
        ></TextBox>
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <AboutSocialSecurityNumberCard />
          </Column>
          <Column className="flex-grow page-section-63_33 items-stretch">
            <MemberListCard
              memberListDetails={[
                {
                  memberName: 'Chris Hall',
                  dateOfBirth: '01/01/1978',
                  isSSN: true,
                },
                {
                  memberName: 'Maddison Hall',
                  dateOfBirth: '01/01/1979',
                  isSSN: true,
                },
                {
                  memberName: 'Forest Hall',
                  dateOfBirth: '01/01/2001',
                  isSSN: true,
                },
                {
                  memberName: 'Corey Hall',
                  dateOfBirth: '01/01/2002',
                  isSSN: false,
                },
                {
                  memberName: 'Telly Hall',
                  dateOfBirth: '01/01/2005',
                  isSSN: true,
                },
                {
                  memberName: 'Janie Hall',
                  dateOfBirth: '01/01/2015',
                  isSSN: false,
                },
              ]}
            />
          </Column>
        </section>
      </Column>
    </div>
  );
};

export default UpdateSocialSecurityNumber;
