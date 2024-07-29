'use client';
import { Dropdown } from '@/components/foundation/Dropdown';
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
      linkURL: 'https://www.bcbst.com',
      title: '508C Telehealth and Telephonic/Audio-Only Services',
      description: 'Telehealth and Telephonic/Audio-Only Services',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Mobile Apps | BlueCross BlueShield of Tennessee',
      description:
        ', telehealth, and provider search with cost estimates -- all from your mobile device.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title:
        'Use Your Health Insurance Plan | BlueCross BlueShield of Tennessee',
      description:
        'Manage your BCBS of Tennessee health insurance plans, login to your account and use our cost estimator tools to help you understand various health insurance coverage options.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Find a Doctor Near You | BlueCross BlueShield of Tennessee',
      description:
        'Search for a doctor, hospital, dental and vision providers or pharmacies in your area. You can search by specialty, location or network to find the healthcare provider that meets your needs. ',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Get Healthcare Near You | BlueCross BlueShield of Tennessee',
      description:
        'Find a doctor, pharmacy or other healthcare and wellness providers in your area.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: '508C Frequently Asked Questions',
      description: 'Frequently Asked Questions',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title:
        '508C REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
      description:
        'REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Healthymom | Providers | BlueCare Tennessee',
      description:
        'Helpful resources to assist with language interpretation when talking to your patients. *These resources are NOT affiliated with or endorsed by BlueCare Tennessee. Fees for their services may apply.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title:
        'Individual and Family Health Insurance Plans | BlueCross BlueShield of Tennessee',
      description:
        'We have a wide range of health insurance plans for you and your family, with premiums as low as $0. Protect yourself and your family with free quotes and easy enrollment.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'BlueCross BlueShield of Tennessee Health Insurance',
      description:
        'Learn more about BlueCross BlueShield of Tennessee (BCBST) health insurance and the medical, dental and vision plans we offer for employers, individuals and families.',
    },
  ];

  const resultListSorted = [
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Mobile Apps | BlueCross BlueShield of Tennessee',
      description:
        ', telehealth, and provider search with cost estimates -- all from your mobile device.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title:
        'Use Your Health Insurance Plan | BlueCross BlueShield of Tennessee',
      description:
        'Manage your BCBS of Tennessee health insurance plans, login to your account and use our cost estimator tools to help you understand various health insurance coverage options.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: '508C Telehealth and Telephonic/Audio-Only Services',
      description: 'Telehealth and Telephonic/Audio-Only Services',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Find a Doctor Near You | BlueCross BlueShield of Tennessee',
      description:
        'Search for a doctor, hospital, dental and vision providers or pharmacies in your area. You can search by specialty, location or network to find the healthcare provider that meets your needs. ',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Get Healthcare Near You | BlueCross BlueShield of Tennessee',
      description:
        'Find a doctor, pharmacy or other healthcare and wellness providers in your area.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: '508C Frequently Asked Questions',
      description: 'Frequently Asked Questions',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title:
        '508C REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
      description:
        'REVISION -Update to Stand-alone Vaccine Counseling (replaces March 15, 2023 memo)',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title: 'Healthymom | Providers | BlueCare Tennessee',
      description:
        'Helpful resources to assist with language interpretation when talking to your patients. *These resources are NOT affiliated with or endorsed by BlueCare Tennessee. Fees for their services may apply.',
    },
    {
      linkURL: 'https://www.bcbst.com',
      title:
        'Individual and Family Health Insurance Plans | BlueCross BlueShield of Tennessee',
      description:
        'We have a wide range of health insurance plans for you and your family, with premiums as low as $0. Protect yourself and your family with free quotes and easy enrollment.',
    },
    {
      linkURL: 'https://www.bcbst.com',
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

  let sortResultList;

  function sortResult() {
    sortResultList = resultListSorted.map((item) => ({
      linkURL: item.linkURL,
      title: item.title,
      description: item.description,
    }));
    setFilteredList(sortResultList);
  }

  return (
    <section className="flex flex-col app-body">
      <SearchField onSearch={handleSearch} hint={'search'} />
      <Spacer size={32} />
      <section className="flex flex-col">
        <Row className="justify-between">
          <TextBox text={resultList.length + ' Results for  ' + 'tel'} />
          <Row>
            <TextBox text="Sort by:&nbsp;" className="mb-2" />
            <Dropdown
              onSelectCallback={() => sortResult()}
              initialSelectedValue="0"
              items={[
                { label: 'Most Relevant', value: '0' },
                { label: 'Newest', value: '1' },
                { label: 'Oldest', value: '2' },
              ]}
            />
          </Row>
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
