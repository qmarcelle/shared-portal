import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { LinkRow } from '@/components/foundation/LinkRow';
import { Pagination } from '@/components/foundation/Pagination';
import { SearchResultItem } from '../models/search_result_item';

interface SearchResultListProps {
  searchString: string;
  searchResults: SearchResultItem[];
  resultCount: number;
}

const openDocument = (url: string) => {
  window.open(url, '_blank');
};

export const SearchResultList = ({
  searchString,
  searchResults,
  resultCount,
}: SearchResultListProps) => {
  return (
    <Pagination<SearchResultItem>
      key={JSON.stringify(searchResults[0] ?? 'rand#') + searchString}
      initialList={searchResults}
      pageSize={10}
      wrapperBuilder={(items) => (
        <Card>
          <Column className="searchResult">{items}</Column>
        </Card>
      )}
      itemsBuilder={(item) => (
        <LinkRow
          key={item.description}
          label={item.title}
          description={
            <div className="body-1 flex flex-row">{item.description}</div>
          }
          onClick={() => openDocument(item.linkURL)}
          divider={true}
        />
      )}
      label="Items"
      totalCount={resultCount}
    />
  );
};
