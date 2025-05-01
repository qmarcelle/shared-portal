import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { extrenalIcon } from '@/components/foundation/Icons';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import { IComponent } from '@/components/IComponent';
import Image from 'next/image';
import { ENROLLMENT_OPTIONS } from '../models/enrollment_options';

export const EnrollmentOptions = ({ className }: IComponent) => {
  return (
    <Card className={className}>
      <Column>
        <Title className="title-2" text="Enrollment Options" />
        <Spacer size={16} />
        <TextBox text="We have two options to keep you and your family protected." />
        <Spacer size={16} />
        {ENROLLMENT_OPTIONS.map((item, index) => (
          <Column className="my-1" key={index}>
            <LinkRow
              label={item.label}
              divider={index < ENROLLMENT_OPTIONS.length - 1 ? true : false}
              description={
                <>
                  <TextBox text={item.description} />
                  <Spacer size={16} />
                  <Row>
                    <TextBox text="Activation Code:" />
                    <TextBox
                      className="font-bold pl-[5px]"
                      text={item.activationCode}
                    />
                  </Row>
                </>
              }
              icon={
                <Image
                  className="-mt-[5px]"
                  src={extrenalIcon}
                  alt="external"
                />
              }
              // Need to handle Outbound SSO Link in future
              onClick={() => {}}
            />
          </Column>
        ))}
      </Column>
    </Card>
  );
};
