'use client';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { UserRole } from '@/userManagement/models/sessionUser';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { PlanSwitcher } from '../composite/PlanSwitcherComponent';
import { SiteHeaderNavSection } from '../composite/SiteHeaderNavSection';
import { SiteHeaderSubNavSection } from '../composite/SiteHeaderSubNavSection';
import { getMenuNavigation } from '../menuNavigation';
import { getMenuNavigationTermedPlan } from '../menuNavigationTermedPlan';
import { SiteHeaderMenuSection } from './../composite/SiteHeaderMenuSection';
import { AlertBar } from './AlertBar';
import {
  bcbstBlueLogo,
  bcbstStackedlogo,
  closeIcon,
  globalIdCardIcon,
  hamburgerMenuIcon,
  inboxIcon,
  profileWhiteIcon,
} from './Icons';

type SiteHeaderProps = {
  visibilityRules: VisibilityRules;
  profiles: UserProfile[];
  selectedProfile: UserProfile;
  plans: PlanDetails[];
  selectedPlan: PlanDetails | undefined;
};

export default function SiteHeader({
  visibilityRules,
  profiles,
  plans,
  selectedPlan,
  selectedProfile,
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubNavId, setActiveSubNavId] = useState<number | null>(null);

  const menuNavigation = selectedPlan?.termedPlan
    ? getMenuNavigationTermedPlan(visibilityRules)
    : getMenuNavigation(visibilityRules);

  const toggleMenu = () => {
    if (!isOpen) {
      closeSubMenu();
    } else {
      setIsOpen(true);
      setActiveSubNavId(null); // Reset submenu on open
    }
  };

  const openSubMenu = (itemId: number) => {
    setIsOpen(true);
    setActiveSubNavId((prevId) => (prevId === itemId ? null : itemId));
  };

  const closeSubMenu = () => {
    setIsOpen(false);
    setActiveSubNavId(null);
  };

  return (
    <>
      <nav
        className={`primary-color sm:pt-[74px] ${selectedPlan ? 'lg:pt-[134px]' : 'lg:pt-[74px]'}`}
      >
        {/* Header Top Bar */}
        <div className="h-18 w-full fixed top-0 left-0 right-0 flex justify-between border-b bg-white z-50">
          <div className="flex items-center">
            <div className="flex lg:hidden h-18 w-18 items-center justify-center border-r">
              <button
                data-collapse-toggle="menu-bar"
                type="button"
                className="p-0 justify-center"
                aria-controls="menu-bar"
                aria-expanded="false"
                onClick={toggleMenu}
              >
                {isOpen ? (
                  <>
                    <span className="sr-only">Close main menu</span>
                    <Image
                      src={closeIcon}
                      alt={'Close icon'}
                      width="18"
                      height="18"
                    ></Image>
                  </>
                ) : (
                  <>
                    <span className="sr-only">Open main menu</span>
                    <Image
                      src={hamburgerMenuIcon}
                      alt={'Menu icon'}
                      width="32"
                      height="32"
                    ></Image>
                  </>
                )}
              </button>
            </div>
            <Link className="ml-5 lg:px-0" href="/dashboard">
              {useMediaQuery({ query: '(max-width: 1023px)' }) ? (
                <Image
                  width="64"
                  height="36"
                  src={bcbstStackedlogo}
                  alt="BCBST Stacked Logo"
                />
              ) : (
                <Image
                  width="174"
                  height="35"
                  src={bcbstBlueLogo}
                  alt="BCBST Logo"
                />
              )}
            </Link>
            {selectedProfile?.type != UserRole.NON_MEM && (
              <PlanSwitcher
                key={selectedProfile.id + selectedPlan?.id}
                className="mx-4 w-[268px] hidden md:block"
                plans={plans}
                selectedPlan={
                  selectedPlan ?? {
                    subscriberName: 'Chris Hall',
                    policies: 'Medical, Vision, Dental',
                    planName: '...',
                    id: 'ABC1234567890',
                    memeCk: '',
                    termedPlan: false,
                  }
                }
                onSelectionChange={() => {}}
              />
            )}
          </div>
          <SiteHeaderMenuSection
            profiles={profiles}
            icon={<Image src={profileWhiteIcon} alt="Profile Icon"></Image>}
            items={
              selectedPlan
                ? selectedPlan.termedPlan
                  ? [
                      {
                        title: 'Inbox',
                        label: 'inbox',
                        icon: <Image src={inboxIcon} alt="Inbox" />,
                        url: 'inbox',
                      },
                    ]
                  : [
                      {
                        title: 'Inbox',
                        label: 'inbox',
                        icon: <Image src={inboxIcon} alt="Inbox" />,
                        url: 'inbox',
                      },
                      {
                        title: 'ID Card',
                        label: 'id card',
                        icon: <Image src={globalIdCardIcon} alt="ID Card" />,
                        url: '/memberIDCard',
                      },
                    ]
                : []
            }
          />
        </div>
        {/* Header Nav Bar */}

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 top-[72px] bg-black bg-opacity-40 z-20"
            onClick={closeSubMenu} // Close on overlay click
          />
        )}

        {selectedPlan && (
          <div
            id="menu-bar"
            className={`fixed top-[72px] h-full md:h-fit shadow-lg transition-transform duration-300 ease-in-out lg:block w-full md:w-1/2 lg:w-full bg-white z-20 overflow-auto ${activeSubNavId !== null ? 'block' : 'hidden'}`}
            data-accordion="collapse"
          >
            <div className="flex font-bold">
              <SiteHeaderNavSection
                parentPages={menuNavigation}
                onOpenOverlay={openSubMenu}
                activeSubNavId={activeSubNavId}
                closeMenuAndSubMenu={closeSubMenu}
              />
            </div>
            <div className="absolute top-0 lg:static w-full lg:w-full bg-white z-50 border-r lg:border-0">
              {menuNavigation.map((page, index) => (
                <div key={page.id}>
                  {activeSubNavId === page.id && (
                    <SiteHeaderSubNavSection
                      key={index}
                      id={page.id}
                      title={page.title}
                      description={page.description}
                      category={page.category}
                      showOnMenu={page.showOnMenu}
                      url={page.url}
                      qt={page.qt}
                      childPages={page.childPages}
                      template={page.template}
                      shortLinks={page.shortLinks}
                      activeSubNavId={activeSubNavId}
                      closeSubMenu={closeSubMenu}
                      visibilityRules={visibilityRules}
                    />
                  )}
                </div>
              ))}
              <AlertBar
                alerts={
                  (process.env.NEXT_PUBLIC_ALERTS?.length ?? 0) > 0
                    ? process.env.NEXT_PUBLIC_ALERTS?.split(';') ?? []
                    : []
                }
              />
            </div>
          </div>
        )}
        {/* NavSub Bars */}
      </nav>
      {selectedProfile.type != UserRole.NON_MEM && (
        <PlanSwitcher
          key={selectedProfile.id + selectedPlan?.id}
          className="mx-2 py-2 block md:hidden"
          plans={plans}
          selectedPlan={
            selectedPlan ?? {
              subscriberName: 'Chris Hall',
              policies: 'Medical, Vision, Dental',
              planName: '...',
              id: 'ABC1234567890',
              memeCk: '',
              termedPlan: false,
            }
          }
          onSelectionChange={() => {}}
        />
      )}
    </>
  );
}
