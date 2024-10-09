import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import React from 'react';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { BenefitDetailItem } from '../components/BenefitDetailItem';
import { ListBenefitDetails } from '../models/benefit_details';

interface BenefitDetailSectionProps extends IComponent {
  benefitDetail: ListBenefitDetails[];
}

export const BenefitDetailSection = ({
  benefitDetail,
}: BenefitDetailSectionProps) => {
  return (
    <div className="flex flex-col">
      {benefitDetail.map((innerArray, index) => (
        <Card className="m-2 mt-4 p-8" key={index}>
          <div key={index}>
            {innerArray.listBenefitDetails.map((value, index) => (
              <React.Fragment key={index}>
                <BenefitDetailItem
                  key={index}
                  className="mb-4"
                  benefitDetailInfo={value}
                />
                {index < innerArray.listBenefitDetails.length - 1 && (
                  <Spacer size={32} />
                )}
              </React.Fragment>
            ))}
            {innerArray.note ? (
              <div>
                <Spacer size={32} />
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
