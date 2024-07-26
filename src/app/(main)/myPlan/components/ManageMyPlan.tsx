import { IComponent } from '@/components/IComponent';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Divider } from '@/components/foundation/Divider';
import { Header } from '@/components/foundation/Header';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Spacer } from '@/components/foundation/Spacer';
import Image from 'next/image';
import { ReactNode } from 'react';
import External from '../../../../../public/assets/external.svg';

export interface ManageMyPlanProps extends IComponent {
  managePlanItems: managePlanItems[];
}

interface managePlanItems {
  title: string;
  body: string;
  externalLink: boolean;
  url: string;
  icon?: ReactNode;
}

export const ManageMyPlan = ({
  managePlanItems,
  className,
}: ManageMyPlanProps) => {
  return (
    <Card className={className}>
      <Column>
        <Header type="title-2" text="Manage My Plan" />
        <Column>
          {managePlanItems.map((items, index) =>
            items.externalLink ? (
              <>
                {' '}
                {/* for the external link image*/}
                <Spacer size={16} />
                <LinkRow
                  key={index}
                  label={items.title}
                  description={
                    <div className="body-1 flex flex-row">{items.body}</div>
                  }
                  divider={false}
                  icon={<Image src={External} alt="link" />}
                  onClick={() => {
                    window.location.href = items.url;
                  }}
                />
                {index !== managePlanItems.length - 1 && <Divider />}
              </>
            ) : (
              <>
                <Spacer size={16} />
                <LinkRow
                  key={index}
                  label={items.title}
                  description={
                    <div className="body-1 flex flex-row">{items.body}</div>
                  }
                  divider={false}
                  onClick={() => {
                    window.location.href = items.url;
                  }}
                />
                {index !== managePlanItems.length - 1 && <Divider />}
              </>
            ),
          )}
        </Column>
      </Column>
    </Card>
  );
};
