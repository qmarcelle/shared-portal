import { SearchDetails, SearchItem } from '@/models/app/searchDetails';
import Link from 'next/link';
import { IComponent } from '../IComponent';
import { Spacer } from '../foundation/Spacer';
import { Divider } from './Divider';
import { HighlightedText } from './HighlightedText';
import { RichText } from './RichText';
import { Row } from './Row';
import { TextBox } from './TextBox';

interface SearchTypeAheadProps extends IComponent {
  searchText: string;
  searchDetails: SearchDetails[];
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
  <div>
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
}: SearchTypeAheadProps) => {
  return (
    <div className="searchSuggestion font-medium text-black scroll w-full">
      <Row
        onClick={() => gotoMain()}
        className="searchForField title-3 px-4 py-2 cursor-pointer"
      >
        <TextBox className="px-2" text={'See all results for '}></TextBox>
        <TextBox className="font-bold" text={searchText}></TextBox>
      </Row>
      <Spacer size={32} />
      <SearchDetailsView
        searchDetails={searchDetails}
        searchText={searchText}
      ></SearchDetailsView>
    </div>
  );
};
