import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import offsiteIcon from '@/public/assets/external.svg';
import Image from 'next/image';
import { DiscountCardsInfo } from '../models/app/discount_cards_info';
import { DiscountInfoCard } from './DiscountInfoCard';

interface MemberDiscountsProps extends IComponent {
  linkTitle: string;
  linkURL?: string;
  showOffsiteIcon: boolean;
  title: string;
  copy: string;
  discountCards: DiscountCardsInfo[];
}

export const MemberDiscounts = ({
  discountCards,
  linkTitle,
  linkURL,
  title,
  copy,
  showOffsiteIcon,
  className,
}: MemberDiscountsProps) => {
  return (
    <Card className={className}>
      <Column className="large-section">
        <Header type="title-2" text={title} />
        <Spacer size={16} />
        <TextBox text={copy} />
        <Spacer size={32} />
        <Row className="flex-wrap">
          {discountCards.map((item) => (
            // eslint-disable-next-line react/jsx-key
            <DiscountInfoCard
              className="card-small"
              icon={item.icon}
              cardLink={item.cardLink}
              url={item.url}
              key={item.id}
              id={item.id}
            />
          ))}
        </Row>
        <Spacer size={32} />
        <div>
          <AppLink
            label={linkTitle}
            displayStyle="inline-flex"
            className="p-0"
            url={linkURL}
          />
          {showOffsiteIcon && (
            <Image src={offsiteIcon} alt="icon" className="inline" />
          )}
        </div>
      </Column>
    </Card>
  );
};
