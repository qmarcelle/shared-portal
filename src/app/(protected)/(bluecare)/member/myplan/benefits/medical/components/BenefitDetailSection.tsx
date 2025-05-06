import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Card } from '@/components/foundation/Card';
import { IComponent } from '@/components/IComponent';
import { BenefitDetailItem } from './BenefitDetailItem';
import { ListBenefitDetails } from '@/app/(protected)/(bluecare)/member/myplan/benefits/models/benefit_details';

interface BenefitDetailSectionProps extends IComponent {
  benefitDetail: ListBenefitDetails[];
}

export const BenefitDetailSection = ({
  benefitDetail,
  className,
}: BenefitDetailSectionProps) => {
  return (
    <div className="flex flex-col">
      {benefitDetail.map((innerArray, index) => (
        <Card className={className} key={index}>
          <div key={index}>
            {innerArray.listBenefitDetails.map((value) => (
              <BenefitDetailItem
                key={value.benefitTitle}
                className="mb-4"
                benefitDetailInfo={value}
              />
            ))}
            {innerArray.note ? (
              <div>
                <Divider />
                <Spacer size={32} />
                <TextBox className="body-1" text={innerArray.note}></TextBox>
              </div>
            ) : (
              ''
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
