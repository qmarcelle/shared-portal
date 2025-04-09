import { ClaimItem } from '@/components/composite/ClaimItem';
import { Header } from '@/components/foundation/Header';
import { ClaimDetails } from '@/models/claim_details';
import Image from 'next/image';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Card } from '../foundation/Card';
import { documentFile } from '../foundation/Icons';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
interface RecentClaimSectionProps extends IComponent {
  claims: ClaimDetails[];
  title: string;
  linkText: string;
  linkUrl?: string;
}

export const RecentClaimSection = ({
  claims,
  className,
  title,
  linkText,
  linkUrl = '/member/myplan/claims',
}: RecentClaimSectionProps) => {
  const renderSection = (
    claims: ClaimDetails[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
    const claimsList = claims.length > 3 ? claims.splice(0, 3) : claims;
    switch (true) {
      case claims && !!claims.length:
        return claimsList.map((item) => (
          <ClaimItem
            key={item.id}
            className="mb-4"
            claimInfo={item}
            callBack={(claimId: string) => {
              item.callBack?.(claimId);
            }}
          />
        ));
      case claims && claims.length === 0:
        return (
          <div className="recentClaimsException">
            <Row className="p-2">
              <Image
                src={documentFile}
                alt="no-claims-found"
                height={40}
                width={40}
              />
              <TextBox
                text="No Claims Found."
                className="inline my-auto ml-4 p-2"
              />
            </Row>
          </div>
        );

      case claims === null || claims === undefined:
        return (
          <div className="recentClaimsException">
            <Row className="p-2">
              <Image
                src={documentFile}
                alt="no-claims-found"
                height={40}
                width={40}
              />
              <TextBox
                text="No Claims Found."
                className="inline my-auto ml-4 p-2"
              />
            </Row>
          </div>
        );
    }
  };
  return (
    <Card className={className}>
      <div className="flex flex-col">
        <Header type="title-2" text={title} />
        <Spacer size={32} />

        {renderSection(claims)}
        <Spacer size={16} />
        <AppLink label={linkText} url={linkUrl} />
      </div>
    </Card>
  );
};
