import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Spacer } from '@/components/foundation/Spacer';
import { Title } from '@/components/foundation/Title';
import { useRouter } from 'next/navigation';

export interface MedicalPharmacyDentalCardProps extends IComponent {
  manageBenefitItems: ManageBenefitsItems[];
  heading: string;
  cardIcon: JSX.Element;
}

export interface ManageBenefitsItems {
  title: string;
  body: string;
  externalLink: boolean;
  onClick?: (serviceCategory: ServiceCategory | undefined) => void;
  url?: string;
  icon?: JSX.Element;
  serviceCategory?: ServiceCategory; // Add this line
}

export const MedicalPharmacyDentalCard = ({
  manageBenefitItems: managePlanItems,
  heading,
  cardIcon,
  className,
}: MedicalPharmacyDentalCardProps) => {
  const router = useRouter();
  return (
    <Card className={className}>
      <Column>
        <Title className="title-2 mt-2 ml-2" text={heading} prefix={cardIcon} />
        <Spacer size={16} />
        <Column>
          {managePlanItems.map((items, index) => (
            <section key={index} className="manage-benefit">
              {' '}
              <Spacer size={16} />
              <LinkRow
                key={index}
                label={items.title}
                description={
                  <div className="body-1 flex flex-row">{items.body}</div>
                }
                divider={false}
                icon={items.icon}
                onClick={() => {
                  if (items.onClick !== undefined) {
                    // Add this line
                    items.onClick(items.serviceCategory);
                  } // Modify this line
                  else if (items.url) {
                    if (items.externalLink) {
                      router.push(items.url);
                    } else {
                      window.location.href = items.url;
                    }
                  }
                }}
              />
              {index !== managePlanItems.length - 1 && <Divider />}
            </section>
          ))}
        </Column>
      </Column>
    </Card>
  );
};
