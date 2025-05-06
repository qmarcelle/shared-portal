import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { LinkRow } from '@/components/foundation/LinkRow';
import { SearchResultItem } from '../models/search_result_item';

interface SearchResultListProps {
  searchResults: SearchResultItem[];
}

const openDocument = (url: string) => {
  window.open(url, '_blank');
};

export const SearchResultList = ({ searchResults }: SearchResultListProps) => {
  return (
    <Card>
      <Column className="flex flex-col searchResult">
        {searchResults.map((item, index) => (
          <LinkRow
            key={index}
            label={item.title}
            description={
              <div className="body-1 flex flex-row">{item.description}</div>
            }
            onClick={() => openDocument(item.linkURL)}
            divider={true}
          />
        ))}
      </Column>
    </Card>
  );
};
