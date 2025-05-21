import { useAppModalStore } from '@/components/foundation/AppModal';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { IComponent } from '@/components/IComponent';
import { ShareOutsideMyPlanDetails } from '@/models/app/getSharePlanDetails';
import Image from 'next/image';
import { ReactElement } from 'react';
import addIcon from '../../../../public/assets/add.svg';
import { AddUserShareOutsideMyPlan } from '../journeys/AddUserShareOutsideMyPlan';
import { ShareOutsideMyPlanItem } from './ShareOutsideMyPlanItem';

interface OnOusideMyPlanDropDownProps extends IComponent {
  ShareOutsideMyPlanDetails: ShareOutsideMyPlanDetails[] | null;
  header?: ReactElement;
  subHeader?: ReactElement;
  icon?: JSX.Element;
}

export const ShareOutsideMyPlanComponent = ({
  ShareOutsideMyPlanDetails,
  header,
  subHeader,
  icon = <Image src={addIcon} alt="" />,
}: OnOusideMyPlanDropDownProps) => {
  const { showAppModal } = useAppModalStore();
  return (
    <Column className="flex flex-col">
      {header}
      {subHeader && (
        <div>
          {' '}
          <Spacer size={16} />
          {subHeader}
          <Spacer size={32} />
        </div>
      )}
      <Column className="flex flex-col">
        {ShareOutsideMyPlanDetails?.length == 0 ? (
          <>
            <Column>
              <Row>
                <Spacer axis="horizontal" size={8} />
                <Card backgroundColor="rgba(0,0,0,0.05)">
                  <Column className="m-4">
                    <Row>
                      <TextBox
                        className="body-1 "
                        text="You are not sharing your information with individuals ouside of your health plan."
                      />
                    </Row>
                  </Column>
                </Card>
              </Row>
              <Spacer size={24} />
            </Column>
          </>
        ) : (
          <>
            {ShareOutsideMyPlanDetails?.map((item, index) => (
              <ShareOutsideMyPlanItem
                key={index}
                className="mb-4"
                memberName={item.memberName}
                DOB={item.DOB}
                sharingType={item.accessStatus}
              />
            ))}
          </>
        )}

        <Row>
          <Title
            className="font-bold primary-color"
            text="Add an Authorized User"
            prefix={icon}
            callback={() => {
              showAppModal({
                content: <AddUserShareOutsideMyPlan />,
              });
            }}
          />
        </Row>
      </Column>
    </Column>
  );
};
