import { Column } from '@/components/foundation/Column';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { DocumentDetails } from '@/models/documents_details';
import { DocumentInfoCard } from '../composite/DocumentInfoCard';
import { Dropdown, SelectItem } from '../foundation/Dropdown';
import { Row } from '../foundation/Row';
import { IComponent } from '../IComponent';

interface OnMyPlanDropDownProps extends IComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedPlanChange: () => any;
  planDetails: SelectItem[];
  selectedPlanId: string;
  documentDetails: DocumentDetails[];
}

export const ListOfDocuments = ({
  onSelectedPlanChange,
  selectedPlanId,
  planDetails,
  documentDetails,
}: OnMyPlanDropDownProps) => {
  const documentCount = documentDetails.length;
  return (
    <Column className="flex flex-col">
      <Spacer size={32} />

      <Row className="justify-between">
        <Row>
          <TextBox type="body-1" text="Filter Results:" />
          <TextBox
            type="body-1"
            className="font-bold ml-2"
            text={documentCount + ' Documents'}
          />
        </Row>
        <Row>
          <TextBox type="body-1" className="mr-2" text="Sort by: " />
          <Dropdown
            onSelectCallback={onSelectedPlanChange}
            initialSelectedValue={selectedPlanId}
            items={planDetails}
          />
        </Row>
      </Row>
      <Spacer size={16} />
      <Column className="flex flex-col">
        {documentDetails.map((item, index) => (
          <DocumentInfoCard
            key={index}
            className="mb-4"
            documentName={item.documentName}
            receivedDate={item.receivedDate}
            memberName={item.memberName}
          />
        ))}
      </Column>
    </Column>
  );
};
