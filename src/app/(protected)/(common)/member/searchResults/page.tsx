/**
 * searchResults
 * Search results
 */
export const metadata = {
  title: 'Search results | Consumer Portal',
  description: 'Search results'
};

'use client';

import { SearchResultsInfoComponent } from '@/app/(protected)/(common)/member/searchResults/components/SearchResultsInfoComponent';
import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';

const SearchResults = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="flex flex-col app-content">
        <Spacer size={32} />
        <section className="flex justify-start self-start">
          <Header className="title-1" text="Search Results" />
          <Spacer size={32} />
        </section>
        <SearchResultsInfoComponent />
      </Column>
    </main>
  );
};

export default SearchResults;
