import { Column } from '@/components/foundation/Column';
import { TextBox } from '@/components/foundation/TextBox';
import { Table } from '../../components/Table';
import { OpenAppInfoBean } from '../../models/OpenAppInfoBean';
import './styles.css';

type Props = {
  applications: OpenAppInfoBean[];
};

export const PastApplications = ({ applications }: Props) => {
  return (
    <Column className="gap-2">
      <TextBox type="title-3" text="Your Past Applications" />
      <Table<OpenAppInfoBean>
        className="table-auto w-fit"
        header={
          <tr className="text-left bg-primary text-white">
            <th>Application Id</th>
            <th>Application Status</th>
            <th>Submission Date</th>
          </tr>
        }
        items={applications}
        itemBuilder={(item) => {
          return (
            <tr>
              <td>{item.applicationID}</td>
              <td>{item.status == 'D' ? 'Draft' : 'Submitted'}</td>
              <td>{item.submittedDate}</td>
            </tr>
          );
        }}
      />
    </Column>
  );
};
