import { SearchDetails, SearchItem } from '@/models/app/searchDetails';
import Link from 'next/link';
import { IComponent } from '../IComponent';
import { ErrorCard } from '../composite/ErrorCard';
import { Spacer } from '../foundation/Spacer';
import { Card } from './Card';
import { Divider } from './Divider';
import { HighlightedText } from './HighlightedText';
import { RichText } from './RichText';
import { Row } from './Row';
import { TextBox } from './TextBox';

interface SearchTypeAheadProps extends IComponent {
  searchText: string;
  searchDetails: SearchDetails[] | null;
  error: boolean | null;
  closeSuggestions: () => void;
  gotoMain: () => void;
}

interface SearchGroupProps extends IComponent {
  content: SearchItem[];
  searchText: string;
}
interface SearchDetailsProps extends IComponent {
  searchDetails: SearchDetails[];
  searchText: string;
}
const SearchGroup = ({ content, searchText }: SearchGroupProps) =>
  content.map((item) => (
    <Link
      key={item.label}
      href={item.url}
      target={item.url.includes('https') ? '_blank' : undefined}
      className="body-1 py-2 px-4 cursor-pointer hover:bg-tertiary-5 block"
    >
      {item.metadata ? (
        <RichText
          spans={[
            <HighlightedText
              key="main"
              text={`${item.label} | `}
              searchTerm={searchText}
            />,
            <HighlightedText
              key="meta"
              text={item.metadata}
              searchTerm={searchText}
              className="italic"
            />,
          ]}
        />
      ) : (
        <HighlightedText key="main" text={item.label} searchTerm={searchText} />
      )}
    </Link>
  ));
const SearchDetailsView = ({
  searchDetails,
  searchText,
}: SearchDetailsProps) => (
  <div className="mt-8">
    {searchDetails.map((item, index) => (
      <div key={index}>
        <TextBox
          className="title-3 py-2 px-4"
          key={item.header}
          text={item.header}
        ></TextBox>
        <Divider />
        <SearchGroup
          content={item.content}
          searchText={searchText}
        ></SearchGroup>
        <Spacer size={32} />
      </div>
    ))}
  </div>
);

export const SearchTypeAhead = ({
  searchText,
  searchDetails,
  gotoMain,
  error,
}: SearchTypeAheadProps) => {
  return (
    <div className="flex flex-col searchSuggestion font-medium text-black scroll-auto w-full">
      <Row
        onClick={() => gotoMain()}
        className="searchForField title-3 px-4 py-2 cursor-pointer"
      >
        <TextBox className="px-2" text={'See all results for '}></TextBox>
        <TextBox className="font-bold" text={searchText}></TextBox>
      </Row>
      {error && (
        <ErrorCard
          className="m-4 max-w-fit"
          errorText="There was a problem loading the search results. Please try refreshing the page or returning to this page later."
        />
      )}
      {searchDetails && searchDetails.length == 0 && (
        <Card type="neutral" className="m-4 max-w-full">
          <p className="m-4 w-full">There are no results for your search.</p>
        </Card>
      )}
      {searchDetails && searchDetails.length > 0 && (
        <SearchDetailsView
          searchDetails={searchDetails}
          searchText={searchText}
        ></SearchDetailsView>
      )}
    </div>
  );
};
