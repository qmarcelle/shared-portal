import { SearchResultItem } from '../models/search_result_item';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { LinkRow } from '@/components/foundation/LinkRow';

interface SearchResultListProps {
  searchResults: SearchResultItem[];
}

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
            divider={true}
          />
        ))}
      </Column>
    </Card>
  );
};
