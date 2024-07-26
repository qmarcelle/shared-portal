import { AppLink } from '@/components/foundation/AppLink';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import Image from 'next/image';
import DownloadIcon from '../../../../../public/assets/Download.svg';
import { IComponent } from '../../../../components/IComponent';
import { Card } from '../../../../components/foundation/Card';
import { Spacer } from '../../../../components/foundation/Spacer';
import { TextBox } from '../../../../components/foundation/TextBox';

interface AuthorizationFormProps extends IComponent {
  linkLabel: string;
  linkURL?: string;
  isMatureMinor: boolean;
  isRepresentative: boolean;
  fullAccess: boolean;
}

export const AuthorizationForm = ({
  linkLabel,
  isMatureMinor,
  isRepresentative,
  fullAccess,
}: AuthorizationFormProps) => {
  function getAuthFormContent() {
    return (
      <Card className="card-main large-section">
        <Column>
          <Header text="Authorization Form" type="title-2" />
          <Spacer size={22} />
          <TextBox text="In some cases related to health information sharing, access and transfers, both parties must agree through an authorization form." />
          <Spacer size={22} />
          <AppLink
            className="!flex p-0"
            label={linkLabel}
            icon={<Image src={DownloadIcon} alt="download form" />}
            callback={() => null}
          />
        </Column>
      </Card>
    );
  }
  return (
    <div>
      {(isRepresentative && isMatureMinor) || (isRepresentative && !fullAccess)
        ? getAuthFormContent()
        : null}
    </div>
  );
};
