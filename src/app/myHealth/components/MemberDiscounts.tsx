import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import offsiteIcon from '../../../../public/assets/external.svg';
import { IComponent } from '../../../components/IComponent';
import { AppLink } from '../../../components/foundation/AppLink';
import { Card } from '../../../components/foundation/Card';
import { Column } from '../../../components/foundation/Column';
import { Header } from '../../../components/foundation/Header';
import { Spacer } from '../../../components/foundation/Spacer';
import { TextBox } from '../../../components/foundation/TextBox';
import { DiscountCardsInfo } from '../models/DiscountCards_Info';
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
      <Column>
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
