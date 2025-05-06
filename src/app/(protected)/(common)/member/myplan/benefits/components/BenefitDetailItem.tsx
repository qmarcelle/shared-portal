import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { BenefitDetails } from '../models/benefit_details';

interface BenefitDetailItemProps extends IComponent {
  benefitDetailInfo: BenefitDetails;
}

export const BenefitDetailItem = ({
  benefitDetailInfo,
}: BenefitDetailItemProps) => {
  return (
    <Column className={'flex flex-col'}>
      <div>
        <Row className="mb-2 w-fit">
          {benefitDetailInfo.benefitTitle ? (
            <TextBox
              className="font-bold mr-2"
              text={benefitDetailInfo.benefitTitle}
            ></TextBox>
          ) : (
            ''
          )}
        </Row>
        {benefitDetailInfo.copayOrCoinsurance ? (
          <TextBox text={benefitDetailInfo.copayOrCoinsurance}></TextBox>
        ) : (
          ''
        )}
      </div>
    </Column>
  );
};
