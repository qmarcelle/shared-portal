'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';
import { getMemberSSNData } from './actions/getMemberSSNData';
import { AboutSocialSecurityNumberCard } from './components/AboutSocialSecurityNumberCard';
import { MemberListCard } from './components/MemberListCard';
import { MemberList } from './models/app/memberList';
export type UpdateSocialSecurityNumberProps = {
  data: MemberList;
};

const UpdateSocialSecurityNumber = ({
  data,
}: UpdateSocialSecurityNumberProps) => {
  const [sSNMemberData, setStateSSNMemberData] = useState<MemberList>(data);
  async function updateMemberList() {
    const result = await getMemberSSNData();
    setStateSSNMemberData(result.data!);
  }

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
          {data?.members && sSNMemberData.members && (
            <Column className="flex-grow page-section-63_33 items-stretch">
              <MemberListCard
                memberListDetails={sSNMemberData.members}
                successCallback={updateMemberList}
              />
            </Column>
          )}
        </section>
      </Column>
    </div>
  );
};

export default UpdateSocialSecurityNumber;
