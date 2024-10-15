import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { BenefitTypeHeaderDetails } from '../models/benefit_type_header_details';

interface BenefitTypeHeaderSectionProps extends IComponent {
  benefitTypeHeaderDetails: BenefitTypeHeaderDetails;
}

export const BenefitTypeHeaderSection = ({
  benefitTypeHeaderDetails,
}: BenefitTypeHeaderSectionProps) => {
  return (
    <Column>
      <Column className="title-1">
        {benefitTypeHeaderDetails.title ?? (
          <Header
            className="mb-0 title-1"
            text={benefitTypeHeaderDetails.title}
          />
        )}
      </Column>
      {benefitTypeHeaderDetails.benefitLevelDetails && (
        <>
          <Spacer size={16} />
          <Column className="mb-2">
            {benefitTypeHeaderDetails.benefitLevelDetails.map(
              (value, index) => (
                <Row key={index} className="mb-2">
                  {' '}
                  <TextBox
                    className="body-1"
                    text={value.benefitLevel}
                  ></TextBox>{' '}
                  &nbsp;: &nbsp;
                  <TextBox
                    className="body-1"
                    text={value.benefitValue}
                  ></TextBox>
                </Row>
              ),
            )}
          </Column>
        </>
      )}
    </Column>
  );
};
