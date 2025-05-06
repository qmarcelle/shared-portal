import { AppLink } from '@/components/foundation/AppLink';
import { Divider } from '@/components/foundation/Divider';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { IComponent } from '@/components/IComponent';
import { Column } from '@/components/foundation/Column';
import { LinkDetails } from '../models/link_details';

interface PharmacyDocumentsProps extends IComponent {
  linkDetails: LinkDetails[];
}

export const PharmacyDocuments = ({ linkDetails }: PharmacyDocumentsProps) => {
  const pharmacyDocumentDetails = linkDetails.filter((item) => !item.isHidden);
  return (
    <Column>
      {pharmacyDocumentDetails.map((item, index) => (
        <Column key={index}>
          <Column className="items-stretch">
            <AppLink
              label={item.linkTitle}
              icon={item.linkIcon}
              className="text-left pl-0"
              displayStyle="inline"
              url={item.linkURL}
            />
            <TextBox text={item.linkDescription} />
            <Spacer size={18} />
            {index != pharmacyDocumentDetails.length - 1 && <Divider />}
            <Spacer size={18} />
          </Column>
        </Column>
      ))}
    </Column>
  );
};
