'use client';

import { Listbox, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { SSOConfig } from '../config';
import {
  BLUE_365_DEEPLINK_MAP,
  BLUE_365_FITNESS,
  BLUE_365_FOOTWEAR,
  BLUE_365_HEARING_VISION,
  BLUE_365_HOME_FAMILY,
  BLUE_365_NUTRITION,
  BLUE_365_PERSONAL_CARE,
  BLUE_365_TRAVEL,
  CVS_DEEPLINK_MAP,
  CVS_DRUG_SEARCH_INIT,
  CVS_PHARMACY_SEARCH_FAST,
  CVS_REFILL_RX,
  EYEMED_DEEPLINK_MAP,
  EYEMED_PROVIDER_DIRECTORY,
  EYEMED_VISION,
  PROV_DIR_DEEPLINK_MAP,
  PROV_DIR_DENTAL,
  PROV_DIR_MEDICAL,
  PROV_DIR_MENTAL_HEALTH,
  PROV_DIR_VISION,
  SSO_IMPL_MAP,
} from '../ssoConstants';

// Define types for our provider groups
type ProviderGroup = {
  name: string;
  providers: Provider[];
};

type Provider = {
  id: string;
  name: string;
  description?: string;
  links: ProviderLink[];
};

type ProviderLink = {
  name: string;
  url: string;
  description?: string;
};

// Get all provider IDs from SSO_IMPL_MAP
const getAllProviderIds = (): string[] => {
  return Array.from(SSO_IMPL_MAP.keys());
};

// Get provider config from SSOConfig
const getProviderConfig = (providerId: string) => {
  return SSOConfig[providerId] || { name: providerId, deepLinks: {} };
};

// Group providers into categories
const groupProviders = (): ProviderGroup[] => {
  const providerIds = getAllProviderIds();

  // Group by types (insurance, pharmacy, benefits, etc.)
  const groups: ProviderGroup[] = [
    { name: 'Healthcare Providers', providers: [] },
    { name: 'Pharmacy Services', providers: [] },
    { name: 'Health & Wellness', providers: [] },
    { name: 'Financial Services', providers: [] },
    { name: 'Other Services', providers: [] },
  ];

  // Helper to assign providers to groups
  const assignToGroup = (id: string, targetGroup: number) => {
    const config = getProviderConfig(id);

    // Create deep links
    const links: ProviderLink[] = [
      { name: 'Default', url: `/sso/launch?PartnerSpId=${id}` },
    ];

    // Add provider-specific deep links
    if (id === process.env.NEXT_PUBLIC_IDP_EYEMED) {
      links.push(
        {
          name: 'Vision',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET!.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_VISION)!)}`,
        },
        {
          name: 'Provider Directory',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_EYEMED_SSO_TARGET!.replace('{DEEPLINK}', EYEMED_DEEPLINK_MAP.get(EYEMED_PROVIDER_DIRECTORY)!)}`,
        },
      );
    } else if (id === process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK) {
      links.push(
        {
          name: 'Drug Search',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET!.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_DRUG_SEARCH_INIT)!)}`,
        },
        {
          name: 'Pharmacy Search',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET!.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_PHARMACY_SEARCH_FAST)!)}`,
        },
        {
          name: 'Refill Rx',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_CVS_SSO_TARGET!.replace('{DEEPLINK}', CVS_DEEPLINK_MAP.get(CVS_REFILL_RX)!)}`,
        },
      );
    } else if (id === process.env.NEXT_PUBLIC_IDP_ON_LIFE) {
      links.push(
        {
          name: 'Challenge',
          url: `/sso/launch?PartnerSpId=${id}&target=Challenge`,
        },
        { name: 'PHA', url: `/sso/launch?PartnerSpId=${id}&target=PHA` },
      );
    } else if (id === process.env.NEXT_PUBLIC_IDP_BLUE_365) {
      links.push(
        {
          name: 'Footwear',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_FOOTWEAR)!))}`,
        },
        {
          name: 'Fitness',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_FITNESS)!))}`,
        },
        {
          name: 'Hearing & Vision',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_HEARING_VISION)!))}`,
        },
        {
          name: 'Nutrition',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_NUTRITION)!))}`,
        },
        {
          name: 'Home & Family',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_HOME_FAMILY)!))}`,
        },
        {
          name: 'Personal Care',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_PERSONAL_CARE)!))}`,
        },
        {
          name: 'Travel',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_TARGET}${encodeURIComponent(process.env.NEXT_PUBLIC_BLUE_365_CATEGORY_SSO_RELAY_STATE!.replace('{DEEPLINK}', BLUE_365_DEEPLINK_MAP.get(BLUE_365_TRAVEL)!))}`,
        },
      );
    } else if (id === process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY) {
      links.push(
        {
          name: 'Medical',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MEDICAL)!)}`,
        },
        {
          name: 'Dental',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_DENTAL)!)}`,
        },
        {
          name: 'Vision',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_VISION)!)}`,
        },
        {
          name: 'Mental Health',
          url: `/sso/launch?PartnerSpId=${id}&TargetResource=${process.env.NEXT_PUBLIC_PROVIDER_DIRECTORY_VITALS_SSO_TARGET!.replace('{DEEPLINK}', PROV_DIR_DEEPLINK_MAP.get(PROV_DIR_MENTAL_HEALTH)!)}`,
        },
      );
    }

    // Add to appropriate group
    groups[targetGroup].providers.push({
      id,
      name: config.name,
      links,
    });
  };

  // Assign providers to groups (manual categorization)
  // Healthcare Providers
  assignToGroup(
    process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY || 'provider-directory',
    0,
  );
  assignToGroup(process.env.NEXT_PUBLIC_IDP_TELADOC || 'teladoc', 0);
  assignToGroup(process.env.NEXT_PUBLIC_IDP_EYEMED || 'eyemed', 0);
  assignToGroup(
    process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH || 'premise-health',
    0,
  );

  // Pharmacy Services
  assignToGroup(process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK || 'cvs-caremark', 1);

  // Health & Wellness
  assignToGroup(process.env.NEXT_PUBLIC_IDP_BLUE_365 || 'blue365', 2);
  assignToGroup(process.env.NEXT_PUBLIC_IDP_ON_LIFE || 'on-life', 2);
  assignToGroup(process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS || 'chip-rewards', 2);
  assignToGroup(process.env.NEXT_PUBLIC_IDP_EMBOLD || 'embold', 2);
  assignToGroup(process.env.NEXT_PUBLIC_IDP_VITALSPRP || 'vitals-prp', 2);

  // Financial Services
  assignToGroup(
    process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY || 'health-equity',
    3,
  );
  assignToGroup(process.env.NEXT_PUBLIC_IDP_HSA_BANK || 'hsa-bank', 3);
  assignToGroup(
    process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK || 'pinnacle-bank',
    3,
  );
  assignToGroup(
    process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA ||
      'electronic-payment-boa',
    3,
  );

  // Filter out empty groups
  return groups.filter((group) => group.providers.length > 0);
};

const DummyPage = () => {
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const providerGroups = groupProviders();

  const filteredGroups =
    selectedGroup === 'all'
      ? providerGroups
      : providerGroups.filter((group) => group.name === selectedGroup);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">SSO Testing Dashboard</h1>

      <p className="mb-6">
        This page allows you to test Single Sign-On (SSO) with all configured
        providers using the refactored implementation. Select a provider group
        and click on any of the links to initiate an SSO session.
      </p>

      <div className="mb-6 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Filter by category:
        </label>

        <Listbox value={selectedGroup} onChange={setSelectedGroup}>
          {({ open }) => (
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm">
                <span className="block truncate">
                  {selectedGroup === 'all' ? 'All Categories' : selectedGroup}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value="all"
                  >
                    All Categories
                  </Listbox.Option>
                  {providerGroups.map((group, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        `relative cursor-pointer select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        }`
                      }
                      value={group.name}
                    >
                      {group.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>

      {filteredGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">{group.name}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.providers.map((provider, providerIndex) => (
              <div
                key={providerIndex}
                className="border border-gray-200 rounded-lg overflow-hidden shadow-sm h-full"
              >
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-1">{provider.name}</h3>

                  <p className="text-sm text-gray-500 mb-3">
                    ID: {provider.id}
                  </p>

                  <hr className="my-3" />

                  <div className="mt-4 space-y-2">
                    {provider.links.map((link, linkIndex) => (
                      <div key={linkIndex}>
                        <Link
                          href={link.url}
                          className={`block w-full text-center py-2 px-4 rounded-md ${
                            linkIndex === 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                          }`}
                          target="_blank"
                        >
                          {link.name}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DummyPage;
