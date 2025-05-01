import { Spacer } from '@/components/foundation/Spacer';
import { IComponent } from '../../../components/IComponent';
import { Column } from '../../../components/foundation/Column';
import { Row } from '../../../components/foundation/Row';
import { TextBox } from '../../../components/foundation/TextBox';
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
              className="body-1 font-bold mr-2"
              text={benefitDetailInfo.benefitTitle}
            ></TextBox>
          ) : (
            ''
          )}
        </Row>
        {benefitDetailInfo.copayOrCoinsurancse ? (
          <TextBox
            className="body-1"
            text={benefitDetailInfo.copayOrCoinsurancse}
          ></TextBox>
        ) : (
          ''
        )}
        <Spacer size={32} />
      </div>
    </Column>
  );
};
