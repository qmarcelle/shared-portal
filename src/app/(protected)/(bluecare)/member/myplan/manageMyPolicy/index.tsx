'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

const ManageMyPolicy = ({}) => {
  return (
    <div className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <Header type="title-1" className="font-bold" text="Manage My policy" />
        <Spacer size={16} />
        <TextBox
          text="Change your plan benefits, update personal information, add/remove dependents, or cancel your policy."
          ariaLabel="Change your plan benefits, update personal information, add/remove dependents, or cancel your policy."
        ></TextBox>
      </Column>
    </div>
  );
};

export default ManageMyPolicy;
