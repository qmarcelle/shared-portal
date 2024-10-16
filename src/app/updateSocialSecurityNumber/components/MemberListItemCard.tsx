import { IComponent } from '@/components/IComponent';
import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { alertErrorIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import Image from 'next/image';
import editIcon from '../../../../public/assets/edit.svg';
import { UpdateSocialSecurityNumberJourney } from './journeys/UpdateSocialSecurityNumber';

interface MemberListItemCardProps extends IComponent {
  memberName: string;
  dOB: string;
  isSSN: boolean;
  icon?: JSX.Element;
}

export const MemberListItemCard = ({
  memberName,
  dOB,
  className,
  isSSN,
  icon = <Image src={editIcon} alt="link" />,
}: MemberListItemCardProps) => {
  const { showAppModal } = useAppModalStore();
  return (
    <Card className={`cursor-pointer ${className}`} type="elevated">
      <Column className="m-4">
        <Spacer size={16} />
        <TextBox className="ml-2 font-bold title-3" text={memberName} />
        <TextBox text={'DOB: ' + dOB} className="ml-2" />
        <Spacer size={16} />
        <Divider />
        <Spacer size={16} />
        {isSSN ? (
          <TextBox className="ml-2" text="A SSN was found on file." />
        ) : (
          <Row>
            <div className="inline-flex">
              <Image
                src={alertErrorIcon}
                className="icon mr-2"
                alt={'ErrorIcon'}
              />
              <TextBox text="No SSN on file." className="text-red-600" />
            </div>
          </Row>
        )}
        <Spacer size={16} />
        <Title
          className="font-bold primary-color ml-2"
          text="Update"
          suffix={icon}
          callback={() =>
            showAppModal({
              content: (
                <UpdateSocialSecurityNumberJourney memberName={memberName} />
              ),
            })
          }
        />
        <Spacer size={16} />
      </Column>
    </Card>
  );
};
