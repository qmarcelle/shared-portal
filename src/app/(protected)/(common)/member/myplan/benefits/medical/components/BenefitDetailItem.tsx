import { BenefitDetails } from '@/app/(protected)/(common)/member/myplan/benefits/models/benefit_details';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';

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
        {benefitDetailInfo.copayOrCoinsurance ? (
          <TextBox
            className="body-1"
            text={benefitDetailInfo.copayOrCoinsurance}
          ></TextBox>
        ) : (
          ''
        )}
        <Spacer size={32} />
      </div>
    </Column>
  );
};
