import { AccordionInfoItem } from '@/models/accordionInfoItem';
import Image from 'next/image';
import { ReactElement } from 'react';
import Down from '../../../public/assets/down.svg';
import Up from '../../../public/assets/up.svg';
import { IComponent } from '../IComponent';
import { Accordion } from '../foundation/Accordion';
import { Column } from '../foundation/Column';

interface TransactionListCardProps extends IComponent {
  information: AccordionInfoItem[];
  successStatus: ReactElement;
}

export const TransactionListCard = ({
  information,
  successStatus,
}: TransactionListCardProps) => {
  return (
    <Column className="items-stretch p-3">
      {information.map((info, index) => (
        <>
          <Accordion
            key={index}
            className="px-2 py-4"
            label={info.title}
            icon={info.icon}
            child={info.body}
            initialOpen={false}
            type="card"
            openIcon={
              <Image className="pl-2 w-6" src={Down} alt="Down Chevron"></Image>
            }
            closeIcon={
              <Image className="pl-2 w-6" src={Up} alt="Up Chevron"></Image>
            }
          ></Accordion>
          <div>{successStatus}</div>
        </>
      ))}
    </Column>
  );
};
