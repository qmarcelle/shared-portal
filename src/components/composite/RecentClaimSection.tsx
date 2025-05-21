import { ClaimItem } from '@/components/composite/ClaimItem';
import { Header } from '@/components/foundation/Header';
import { ClaimDetails } from '@/models/claim_details';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { IComponent } from '../IComponent';
import { AppLink } from '../foundation/AppLink';
import { Card } from '../foundation/Card';
import { documentFile } from '../foundation/Icons';
import { Row } from '../foundation/Row';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';
interface RecentClaimSectionProps extends IComponent {
  claimDetails?: ClaimDetails[]; // Add the claims property
  title: string;
  linkText: string;
  linkUrl?: string;
}

export const RecentClaimSection = ({
  claimDetails,
  className,
  title,
  linkText,
  linkUrl,
}: RecentClaimSectionProps) => {
  const router = useRouter();
  const renderSection = (claimDetails: ClaimDetails[] | undefined) => {
    const claimDetailsLength = (claimDetails ?? []).length;
    const claimsList =
      claimDetailsLength > 3
        ? (claimDetails ?? []).slice(claimDetailsLength - 3, claimDetailsLength)
        : (claimDetails ?? []);
    claimsList.reverse();
    const updatedClaimsList = claimsList.map((claim) => ({
      ...claim,
      isMiniCard: true,
    }));

    const navigateToClaimDetails = (claimId: string) => {
      const claimType = updatedClaimsList.find(
        (claim) => claim.encryptedClaimId === claimId,
      )?.type;
      router.push(`/claims/${claimId}?type=${claimType}`);
    };
    switch (true) {
      case updatedClaimsList && !!claimDetailsLength:
        return (updatedClaimsList ?? []).map((item) => (
          <ClaimItem
            key={item.id}
            className="mb-4"
            claimInfo={item}
            callBack={navigateToClaimDetails}
          />
        ));
      case updatedClaimsList && claimDetailsLength === 0:
        return (
          <div className="recentClaimsException">
            <Row className="p-2">
              <Image src={documentFile} alt="" height={40} width={40} />
              <TextBox
                text="No Claims Found."
                className="inline my-auto ml-4 p-2"
              />
            </Row>
          </div>
        );

      case updatedClaimsList === null || updatedClaimsList === undefined:
        return (
          <div className="recentClaimsException">
            <Row className="p-2">
              <Image src={documentFile} alt="" height={40} width={40} />
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

        {renderSection(claimDetails)}
        <Spacer size={16} />
        <AppLink label={linkText} url={linkUrl} />
      </div>
    </Card>
  );
};
