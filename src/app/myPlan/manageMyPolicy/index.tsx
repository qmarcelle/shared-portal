'use client';

import { MemberData } from '@/actions/loggedUserInfo';
import { IHBC } from '@/app/ihbc/IHBC';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { LoggedInMember } from '@/models/app/loggedin_member';

type Props = {
  loggedInMember: LoggedInMember;
  members: MemberData[];
};

const ManageMyPolicy = ({ loggedInMember, members }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" className="font-bold" text="Manage My policy" />
        <Spacer size={16} />
        <TextBox
          text="Change your plan benefits, update personal information, add/remove dependents, or cancel your policy."
          ariaLabel="Change your plan benefits, update personal information, add/remove dependents, or cancel your policy."
        ></TextBox>
        <IHBC loggedInMember={loggedInMember} members={members} />
      </Column>
    </div>
  );
};

export default ManageMyPolicy;
