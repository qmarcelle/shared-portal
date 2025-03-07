import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { UserRole } from '@/userManagement/models/sessionUser';
import { getViewAsRoleNameFromType } from '@/utils/role_name_converter';
import Image from 'next/image';
import rightIcon from '../../../../public/assets/right.svg';

interface SwitchAccountItemProps extends IComponent {
  id: string;
  memberName: string;
  DOB: string;
  role: UserRole;
  onChange: (val: string) => void;
}

export const SwitchAccountItem = ({
  id,
  memberName,
  DOB,
  className,
  role,
  onChange,
}: SwitchAccountItemProps) => {
  return (
    <Card className={`cursor-pointer  ${className}`} type="elevated">
      <Column className="m-4">
        <TextBox className="body-2" text={getViewAsRoleNameFromType(role)} />
        <Row className="justify-between" onClick={() => onChange(id)}>
          <TextBox
            className={'!font-bold title-3 text-[--primary-color]'}
            text={memberName}
          />
          <Image src={rightIcon} alt="link" />
        </Row>
        <Row>
          <TextBox text="DOB: " ariaLabel="DOB: " />
          <TextBox ariaLabel={DOB} text={DOB} />
        </Row>
      </Column>
    </Card>
  );
};
