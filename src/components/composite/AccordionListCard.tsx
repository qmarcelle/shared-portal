import { AccordionInfoItem } from '@/models/accordionInfoItem';
import { IComponent } from '../IComponent';
import { Accordion } from '../foundation/Accordion';
import { Card } from '../foundation/Card';
import { Column } from '../foundation/Column';
import { Divider } from '../foundation/Divider';
import { Header } from '../foundation/Header';
import { Spacer } from '../foundation/Spacer';

interface AccordionListCardProps extends IComponent {
  header: string;
  information: AccordionInfoItem[];
}

export const AccordionListCard = ({
  header,
  information,
  className,
}: AccordionListCardProps) => {
  return (
    <Card className={`${className ?? ''} ${header ? 'large-section' : ''}`}>
      <Column className="items-stretch">
        {header && (
          <div>
            <Header className="title-2" text={header}></Header>
            <Spacer size={22} />
          </div>
        )}
        {information.map((info, index) => (
          <>
            <Accordion
              key={index}
              className="px-2 py-4 "
              label={info.title}
              icon={info.icon}
              child={info.body}
              initialOpen={false}
              type="card"
              openIcon={
                <img
                  className="pl-2 w-6"
                  src="/assets/down.svg"
                  alt="Down Chevron"
                />
              }
              closeIcon={
                <img
                  className="pl-2 w-6"
                  src="/assets/up.svg"
                  alt="Up Chevron"
                />
              }
            ></Accordion>
            {index !== information.length - 1 && <Divider />}
          </>
        ))}
      </Column>
    </Card>
  );
};
