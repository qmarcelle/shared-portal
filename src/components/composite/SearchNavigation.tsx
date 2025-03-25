import { useSmartSearchStore } from '@/stores/smartSearchStore';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import searchIcon from '../../../public/assets/Search.svg';
import CloseIcon from '../../../public/assets/close.svg';
import { IComponent } from '../IComponent';
import SearchField from '../foundation/SearchField';
import { SearchTypeAhead } from '../foundation/SearchTypeAhead';
import { Spacer } from '../foundation/Spacer';
import { TextBox } from '../foundation/TextBox';

export const SearchNavigation = ({ className }: IComponent) => {
  const { searchText, getSmartSearch, updateSearchText, searchResults } =
    useSmartSearchStore();
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchSuggestion, setShowSearchSuggestion] = useState(false);

  useEffect(() => {
    if (searchText.length >= 3) {
      const getSearchResults = setTimeout(async () => {
        await getSmartSearch();
      }, 500);

      return () => clearTimeout(getSearchResults);
    }
  }, [getSmartSearch, searchText]);

  function closeSearch() {
    setShowSearchBar(false);
    setShowSearchSuggestion(false);
    updateSearchText('');
  }

  const handleSearch = (searchVal: string) => {
    if (searchVal.length >= 3) {
      setShowSearchSuggestion(true);
      updateSearchText(searchVal);
    }
  };

  const SearchBar = () => (
    <div className={`flex flex-row align-top m-2 searchBar ${className}`}>
      <div
        className="flex flex-col flex-grow "
        style={{ height: 40 }}
        onClick={() => {}}
      >
        <SearchField
          classValue="search-textfield-input"
          searchText={searchText}
          onSearch={handleSearch}
          hint="Search for claims, documents, and more..."
        ></SearchField>
        {showSearchSuggestion ? (
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
      <div className="flex flex-row align-top m-4">
        <div
          className="flex flex-row"
          onClick={() => {
            setShowSearchBar(true);
          }}
        >
          <a>
            <TextBox className="link-row-head" text="Search" />
          </a>
          <Spacer size={8} />
          <Image src={searchIcon} className="icon items-end" alt="Search" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col self-strectch w-full items-end">
      {renderSearch()}
    </div>
  );
};
