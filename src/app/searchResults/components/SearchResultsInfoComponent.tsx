'use client';
import { invokeSmartSearchInquiry } from '@/actions/smartSearch';
import { ErrorCard } from '@/components/composite/ErrorCard';
import { IconCard } from '@/components/composite/IconCard';
import { Dropdown } from '@/components/foundation/Dropdown';
import { documentEmptyIcon } from '@/components/foundation/Icons';
import { Row } from '@/components/foundation/Row';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Banner as BannerFromResp } from '@/models/enterprise/smartSearchInquiryResponse';
import { getVisiblePageList } from '@/store/PageHierarchy';
import { transformFusionSearchInquiryIntoDetails } from '@/utils/fusion_search_result_page_resp_mapper';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { searchBanners } from '../data/searchBanners';
import { Banner } from '../models/banner';
import { SearchResultItem } from '../models/search_result_item';
import { SearchBanner } from './SearchBanner';
import { SearchResultList } from './SearchResultList';

export const SearchResultsInfoComponent = () => {
  const searchParams = useSearchParams();
  const [sortVal, setSortVal] = useState('score');
  const [resultsCount, setResultsCount] = useState(0);
  const [banner, setBanner] = useState<Banner>();
  const [error, setError] = useState(false);
  const visiblePageList = getVisiblePageList().join(',');
  console.log('VisiblePageList in search ' + visiblePageList);

  const [searchText, setSearchText] = useState(
    searchParams.get('searchTerm') ?? '',
  );
  const [filteredList, setFilteredList] = useState<SearchResultItem[] | null>(
    null,
  );

  useEffect(() => {
    handleSearch(searchText);
  }, []);

  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = async (searchTerm: any) => {
    setSearchText(searchTerm);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(async () => {
      const searchResp = await invokeSmartSearchInquiry(
        searchTerm,
        sortVal,
        visiblePageList,
      );
      if (searchResp.status == 200) {
        setError(false);
        if (searchResp.data?.fusion) {
          const banner = JSON.parse(
            searchResp.data?.fusion?.banner[0],
          ) as BannerFromResp;
          setBanner(searchBanners[banner.url]);
        } else {
          setBanner(undefined);
        }
        setResultsCount(searchResp.data?.response.numFound ?? 0);
        setFilteredList(
          transformFusionSearchInquiryIntoDetails(searchResp.data!),
        );
      } else {
        setError(true);
        setBanner(undefined);
      }
    }, 600);
  };

  async function sortResult(sortBy: string) {
    setSortVal(sortBy);
    const searchResp = await invokeSmartSearchInquiry(
      searchText,
      sortBy,
      visiblePageList,
    );
    if (searchResp.status == 200) {
      setFilteredList(
        transformFusionSearchInquiryIntoDetails(searchResp.data!),
      );
    } else {
      setError(true);
      setBanner(undefined);
    }
  }

  return (
    <section className="flex flex-col">
      <SearchField
        searchText={searchText}
        onSearch={(val) => handleSearch(val)}
        hint={'search'}
      />
      <Spacer size={32} />
      <section className="flex flex-col">
        <Row className="justify-between">
          {(filteredList?.length ?? 0) > 0 && (
            <TextBox text={resultsCount + ' Results for  ' + searchText} />
          )}
          {!error && (
            <Row>
              <TextBox text="Sort by:&nbsp;" className="mb-2" />
              <Dropdown
                onSelectCallback={(val) => sortResult(val)}
                initialSelectedValue={sortVal}
                items={[
                  { label: 'Most Relevant', value: 'score' },
                  { label: 'Newest', value: 'newest' },
                  { label: 'Oldest', value: 'oldest' },
                ]}
              />
            </Row>
          )}
        </Row>
      </section>
      <Spacer size={16} />
      {error && (
        <ErrorCard
          className="w-full"
          errorText="There was a problem loading the search results. Please try refreshing the page or returning to this page later."
        />
      )}
      {filteredList && filteredList.length == 0 && (
        <IconCard
          prefixIcon={<Image src={documentEmptyIcon} alt="" />}
          text="There are no results for your search."
        />
      )}
      {banner && (
        <SearchBanner
          title={banner.title}
          description={banner.description}
          link={banner.link}
          linkText={banner.linkText}
          external={banner.external ?? banner.sso}
        />
      )}
      <Spacer size={16} />
      {filteredList && filteredList.length > 0 && !error && (
        <SearchResultList
          searchString={searchText}
          searchResults={filteredList}
          resultCount={resultsCount}
        />
      )}
    </section>
  );
};

export default SearchResultsInfoComponent;
