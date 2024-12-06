import { ClaimFormsItemCard } from '@/app/claims/submitAClaim/components/ClaimFormsItemCard';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { ClaimFormsDetails } from '../models/claim_form_list_details';
interface ClaimFormsCardProps extends IComponent {
  claimFormsDetails: ClaimFormsDetails[];
}

export const ClaimFormsCard = ({ claimFormsDetails }: ClaimFormsCardProps) => {
  return (
    <Card>
      <Column className="m-8">
        <Header className="title-2" text="Claim Forms" />
        <Spacer size={16} />
        <TextBox
          className="body-1"
          text="Select the type of claim you need to submit."
          ariaLabel="Select the type of claim you need to submit."
        ></TextBox>
        <Spacer size={16} />

        {claimFormsDetails.map((item, index) => (
          <Column key={index}>
            <ClaimFormsItemCard
              key={index}
              title={item.title}
              description={item.description}
              url={item.url}
            />
            {index !== claimFormsDetails.length - 1 && (
              <>
                <Divider />
                <Spacer size={16} />
              </>
            )}
          </Column>
        ))}
      </Column>
    </Card>
  );
};
