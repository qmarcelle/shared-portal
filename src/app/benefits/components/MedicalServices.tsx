import { Column } from '@/components/foundation/Column';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import { IComponent } from '../../../components/IComponent';
import { Card } from '../../../components/foundation/Card';
import { Dropdown, SelectItem } from '../../../components/foundation/Dropdown';
import { Spacer } from '../../../components/foundation/Spacer';

import { TextBox } from '@/components/foundation/TextBox';
import { ServicesUsed } from '@/models/app/servicesused_details';
import { MedicalServicesUsedChart } from './MedicalServicesUsedChart';

export interface MedicalServicesProps extends IComponent {
  members: SelectItem[];
  selectedMemberId: string;
  medicalServiceDetailsUsed: ServicesUsed[];
  onSelectedMemberChange: () => void;
}

export const MedicalServices = ({
  members,
  className,
  selectedMemberId,
  medicalServiceDetailsUsed,
  onSelectedMemberChange,
}: MedicalServicesProps) => {
  return (
    <Card className={className}>
      <Column>
        <h2 className="title-2">Medical Services Used</h2>
        <Spacer size={32} />
        <TextBox
          className="body-1"
          text="Some services have limits on how many are covered. You may still have a cost for them. If you reach maximum, you can still get them, but your plan won't cover them."
        ></TextBox>
        <Spacer size={16} />
        <Row className="flex flex-row">
          <p>Member :</p>
          <Spacer axis="horizontal" size={8} />
          <Dropdown
            onSelectCallback={onSelectedMemberChange}
            initialSelectedValue={selectedMemberId}
            items={members}
          />
        </Row>
        <Spacer size={8} />
        <MedicalServicesUsedChart
          medicalServiceDetails={medicalServiceDetailsUsed}
        />
        <Column>
          <RichText
            type="body-2"
            spans={[
              <span key={0}>
                Services Used is based on your processed claims. There may be a
                delay in the Services Used list updating. If you&apos;re unsure
                if a service has been used,{' '}
              </span>,
              <span className="link" key={1}>
                <a> start a chat </a>
              </span>,
              <span key={3}> or call us at [1-800-000-0000].</span>,
            ]}
          />
        </Column>
      </Column>
    </Card>
  );
};
