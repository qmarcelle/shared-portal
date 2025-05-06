import { IComponent } from '@/components/IComponent';
import { AppLink } from '@/components/foundation/AppLink';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { externalIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import SelectPCPImage from 'select_pcp.png';
import Image from 'next/image';

interface ProviderDirectoryProps extends IComponent {
  icon?: JSX.Element;
}

export const ProviderDirectory = ({
  icon = <Image src={externalIcon} alt="link" />,
}: ProviderDirectoryProps) => {
  return (
    <Card className="m-4 p-8">
      <Row className="md:!flex !block ">
        <Column className="md:w-10/12">
          <Header
            className="title-2"
            text="Option 1: Find & Select a Provider From a Directory"
          />
          <Spacer size={16} />
          <TextBox
            className="body-1"
            text="You can search for an in-network doctor using our directory. Simply find an eligible doctor then use the Select As PCP button them as your PCP."
          />
          <Spacer size={32} />
          <AppLink
            label="Go to Directory to Find a Doctor"
            icon={icon}
            className="!flex pl-0"
            url="https://bcbst.sapphirecareselect.com/search/search_specialties/980000071/1/%7B%22limit%22:10,%22radius%22:%2225%22,%22sort%22:%22has_sntx%20desc,%20distance%20asc%22,%22sort_translation%22:%22app_global_sort_distance%22,%22preserveFilters%22:true,%22is_pcp%22:%22Y%22%7D?network_id=39&locale=en"
          />
          <Spacer size={52} />
        </Column>

        <Column className="">
          <Row className="flex flex-row">
            <Image src={SelectPCPImage} alt="SelectPCPImage" />
            <Spacer size={52} />
          </Row>
        </Column>
      </Row>
    </Card>
  );
};
