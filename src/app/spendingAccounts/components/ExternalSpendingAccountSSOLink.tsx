import { AppLink } from '@/components/foundation/AppLink';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import { HealthAccountInfo } from '../model/myHealthCareResponseDTO';

export type ExternalSpendingAccountSSOLinkProps = {
  accountInfo: HealthAccountInfo;
};

const ExternalSpendingAccountSSOLink = ({
  accountInfo,
}: ExternalSpendingAccountSSOLinkProps) => {
  return (
    <section className="flex justify-start self-start">
      <RichText
        spans={[
          <Row
            className="body-1 flex-grow md:!flex !block align-top mt-4 ml-4"
            key={1}
          >
            To manage your health spending account details
            <AppLink
              label={accountInfo.linkName || ''}
              url={accountInfo.linkUrl}
              className="link caremark !flex pt-0"
              icon={<Image src={externalIcon} alt="" />}
            />
          </Row>,
        ]}
      />
    </section>
  );
};

export default ExternalSpendingAccountSSOLink;
