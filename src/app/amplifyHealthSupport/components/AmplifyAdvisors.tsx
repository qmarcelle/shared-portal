import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { medicalIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import calendarIcon from '@/public/assets/calendar.svg';
import careManagementIcon from '@/public/assets/care_management.svg';
import dollarIcon from '@/public/assets/dollar.svg';
import questionMarkIcon from '@/public/assets/question_mark.svg';
import searchIcon from '@/public/assets/search.svg';
import Image from 'next/image';

export const AmplifyAdvisors = () => {
  return (
    <Card className="large-section shadow-lg">
      <Column>
        <Header className="title-3" text="Your AmplifyHealth Advisors can:" />
        <Spacer size={16}></Spacer>
        <section className="md:flex md:flex-row">
          <Column className="max-w-[450px]">
            <Row className="py-2">
              <Image src={searchIcon} alt="search" />
              <TextBox className="pl-2" text="Find providers close to you" />
            </Row>
            <Row className="py-2">
              <Image src={dollarIcon} alt="dollar" />
              <TextBox className="pl-2" text="Save you money on health costs" />
            </Row>
            <Row className="py-2">
              <Image src={medicalIcon} alt="medical" />
              <TextBox
                className="pl-2"
                text="Help with prior approvals or other complex parts of health care"
              />
            </Row>
          </Column>
          <Column>
            <Row className="py-2">
              <Image src={calendarIcon} alt="calendar" />
              <TextBox
                className="pl-2"
                text="Schedule your appointments, tests and procedures"
              />
            </Row>
            <Row className="py-2">
              <Image src={questionMarkIcon} alt="dollar" />
              <TextBox
                className="pl-2"
                text="Give you extra support for health needs and questions"
              />
            </Row>
            <Row className="py-2">
              <Image src={careManagementIcon} alt="care management" />
              <TextBox
                className="pl-2"
                text="Recommend programs for healthy living"
              />
            </Row>
          </Column>
        </section>
      </Column>
    </Card>
  );
};
