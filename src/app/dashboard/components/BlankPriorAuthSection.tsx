import { Card } from '@/components/foundation/Card';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import EmptyStateDocument from '../../../../public/assets/empty_state_document.svg';

export const BlankPriorAuthSection = () => {
  return (
    <Card className="neutral container">
      <div className="flex m-4">
        <Image
          src={EmptyStateDocument}
          className="icon-document"
          alt="EmptyStateDocument"
        />
        <Spacer axis="horizontal" size={20} />
        <label className="body-1">
          No prior authorizations in the last 90 days.
        </label>
      </div>
    </Card>
  );
};
