'use client';
import { AppLink } from '@/components/foundation/AppLink';
import { Row } from '@/components/foundation/Row';
import SearchField from '@/components/foundation/SearchField';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { useState } from 'react';
import { SearchResultList } from '../components/SearchResultList';
import { SearchBanner } from './SearchBanner';

export const SearchResultsInfoComponent = () => {
  const resultList = [
    {
      title: '508C Telehealth and Telephonic/Audio-Only Services',
      description: 'Telehealth and Telephonic/Audio-Only Services',
    },
    {
      title: 'Mobile Apps | BlueCross BlueShield of Tennessee',
      description:
        ', telehealth, and provider search with cost estimates -- all from your mobile device.',
    },
    {
      title:
        'Use Your Health Insurance Plan | BlueCross BlueShield of Tennessee',
      description:
        'Manage your BCBS of Tennessee health insurance plans, login to your account and use our cost estimator tools to help you understand various health insurance coverage options.',
    },
    {
      title: 'Find a Doctor Near You | BlueCross BlueShield of Tennessee',
      description:
        'Search for a doctor, hospital, dental and vision providers or pharmacies in your area. You can search by specialty, location or network to find the healthcare provider that meets your needs. ',
    },
    {
      title: 'Get Healthcare Near You | BlueCross BlueShield of Tennessee',
      description:
        'Find a doctor, pharmacy or other healthcare and wellness providers in your area.',
    },
    {
      title: '508C Frequently Asked Questions',
      description: 'Frequently Asked Questions',
    },
    {
      title:
        '508C REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
      description:
        'REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
    },
    {
      title: 'Healthymom | Providers | BlueCare Tennessee',
      description:
        'Helpful resources to assist with language interpretation when talking to your patients. *These resources are NOT affiliated with or endorsed by BlueCare Tennessee. Fees for their services may apply.',
    },
    {
      title:
        'Individual and Family Health Insurance Plans | BlueCross BlueShield of Tennessee',
      description:
        'We have a wide range of health insurance plans for you and your family, with premiums as low as $0. Protect yourself and your family with free quotes and easy enrollment.',
    },
    {
      title: 'BlueCross BlueShield of Tennessee Health Insurance',
      description:
        'Learn more about BlueCross BlueShield of Tennessee (BCBST) health insurance and the medical, dental and vision plans we offer for employers, individuals and families.',
    },
  ];

  const [searchText, setSearchText] = useState('');
  const [filteredList, setFilteredList] = useState(resultList);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearch = (searchTerm: any) => {
    setSearchText(searchTerm);
    const filteredList = resultList.filter((result) =>
      result.title.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredList(filteredList);
  };

  return (
    <section className="flex flex-col app-body">
      <SearchField onSearch={handleSearch} hint={'search'} />
      <Spacer size={32} />
      <section className="flex flex-col">
        <Row className="justify-between">
          <TextBox text={resultList.length + ' Results for  ' + 'tel'} />
          <section className="flex flex-row items-end">
            <TextBox text="Sort by:" className="mb-2" />
            <AppLink label="Most Relevant" />
          </section>
        </Row>
      </section>
      <Spacer size={16} />
      <SearchBanner />
      <Spacer size={16} />
      <SearchResultList searchResults={filteredList} />
    </section>
  );
};

export default SearchResultsInfoComponent;
