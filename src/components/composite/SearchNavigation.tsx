import { invokeSmartSearch } from '@/actions/smartSearch';
import { SearchDetails } from '@/models/app/searchDetails';
import { transformSearchResponseToDetails } from '@/utils/fusion_search_response_mapper';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import CloseIcon from '../../../public/assets/close.svg';
import searchIcon from '../../../public/assets/search.svg';
import { IComponent } from '../IComponent';
import SearchField from '../foundation/SearchField';
import { SearchTypeAhead } from '../foundation/SearchTypeAhead';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

export const SearchNavigation = ({ className }: IComponent) => {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchDetails[] | null>(
    null,
  );
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchSuggestion, setShowSearchSuggestion] = useState(false);

  useEffect(() => {
    console.log('Running effect');
    if (searchText.length == 0) {
      setShowSearchSuggestion(false);
      setSearchResults(null);
      console.log('Search suggestion to false');
      return;
    }

    if (searchText.length >= 3) {
      const getSearchResults = setTimeout(async () => {
        const result = await invokeSmartSearch(searchText);
        if (result.status == 200) {
          setSearchResults(transformSearchResponseToDetails(result.data!));
        }
      }, 500);

      return () => clearTimeout(getSearchResults);
    }
  }, [searchText]);

  function closeSearch() {
    setShowSearchBar(false);
    setShowSearchSuggestion(false);
    setSearchText('');
  }

  const handleSearch = (searchVal: string) => {
    setSearchText(searchVal);
    if (searchVal.length >= 3) {
      setShowSearchSuggestion(true);
    }
  };

  const SearchBar = () => (
    <div
      className={`flex flex-row align-top m-2 hover:bg-white w-full ${className}`}
    >
      <div className="flex flex-col flex-grow relative" onClick={() => {}}>
        <SearchField
          classValue="search-textfield-input"
          searchText={searchText}
          onSearch={handleSearch}
          hint="Search for claims, documents, and more..."
          autoFocus={true}
        ></SearchField>
        {showSearchSuggestion && searchResults ? (
          <SearchTypeAhead
            searchText={searchText}
            searchDetails={searchResults}
          />
        ) : null}
      </div>
      <Spacer size={8} axis="horizontal" />
      <div
        className="flex flex-col"
        onClick={() => {
          closeSearch();
        }}
      >
        <Spacer size={14} axis="vertical" />
        <Image
          src={CloseIcon}
          className=""
          height={12}
          width={12}
          alt={'CloseIcon'}
        />
      </div>
      <Spacer size={8} axis="horizontal" />
    </div>
  );

  function renderSearch() {
    return showSearchBar ? (
      <SearchBar />
    ) : (
      <div className="flex flex-row align-top">
        <div
          tabIndex={0}
          className="flex flex-row rounded-[4px] m-4 box-border items-end focus:outline-none focus:ring-2 focus:ring-primary-color"
          onClick={() => {
            setShowSearchBar(true);
          }}
        >
          <a>
            <TextBox className="link-row-head" text="Search" />
          </a>
          <Spacer size={8} />
          <Image
            src={searchIcon}
            className="icon items-end ml-1"
            alt="Search"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex font-bold focus:outline-none hover:bg-secondary-focus focus:ring-2 focus:ring-primary-color ${showSearchBar ? 'w-full' : 'w-fit'}`}
    >
      {renderSearch()}
    </div>
  );
};
