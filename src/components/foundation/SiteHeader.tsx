'use client';
import { setExternalSessionToken } from '@/actions/ext_token';
import { useLoginStore } from '@/app/login/stores/loginStore';
import { appPaths } from '@/models/app_paths';
import { PlanDetails } from '@/models/plan_details';
import { UserProfile } from '@/models/user_profile';
import { setVisiblePageList } from '@/store/PageHierarchy';
import { UserRole } from '@/userManagement/models/sessionUser';
import { logger } from '@/utils/logger';
import { VisibilityRules } from '@/visibilityEngine/rules';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { SessionIdleTimer } from '../clientComponents/IdleTimer';
import { BreadCrumb } from '../composite/BreadCrumb';
import { PlanSwitcher } from '../composite/PlanSwitcherComponent';
import { SiteHeaderNavSection } from '../composite/SiteHeaderNavSection';
import { SiteHeaderSubNavSection } from '../composite/SiteHeaderSubNavSection';
import { getMenuNavigation } from '../menuNavigation';
import { getMenuNavigationTermedPlan } from '../menuNavigationTermedPlan';
import { SiteHeaderMenuSection } from './../composite/SiteHeaderMenuSection';

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
  isLoggedIn: boolean;
  visibilityRules: VisibilityRules;
  profiles: UserProfile[];
  selectedProfile: UserProfile;
  plans: PlanDetails[];
  selectedPlan: PlanDetails | undefined;
  userId?: string;
  groupId?: string;
};

export default function SiteHeader({
  isLoggedIn,
  visibilityRules,
  profiles,
  plans,
  selectedPlan,
  selectedProfile,
  userId,
  groupId,
}: SiteHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubNavId, setActiveSubNavId] = useState<number | null>(null);
  const [pathname, setPathName] = useState<string>('/');
  const [updateLoggedUser, resetToHome] = useLoginStore((state) => [
    state.updateLoggedUser,
    state.resetToHome,
  ]);
  const sitePathName = usePathname();

  useEffect(() => {
    try {
      (window?.dataLayer ?? []).push({
        business_unit: 'member',
        page_name: window.document.title,
        page_type: undefined,
        content_type: undefined,
        user_id: userId,
        group_id: groupId,
      });
    } catch (error) {
      logger.error('googleAnalytics Site Navigation PageLevel Metadata', error);
    }
  }, [window.document.title]);
  useEffect(() => {
    setPathName(sitePathName);
  }, [sitePathName]);

  useEffect(() => {
    resetToHome();
    updateLoggedUser(true); // Update logged in state as true to reload the login page on expiry
  }, []);

  const menuNavigation = selectedPlan?.termedPlan
    ? getMenuNavigationTermedPlan(visibilityRules)
    : getMenuNavigation(visibilityRules).filter((val) => val.showOnMenu);

  const pageList = [];
  for (let i = 0; i < menuNavigation.length; i++) {
    if (menuNavigation[i]?.showOnMenu) {
      const parent = menuNavigation[i];
      pageList.push(menuNavigation[i].url);
      for (let j = 0; j < parent?.childPages.length; j++) {
        if (parent.childPages[j]?.showOnMenu(visibilityRules)) {
          pageList.push(parent.childPages[j].url);
        }
      }
    }
  }
  setVisiblePageList(pageList);

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

  useEffect(() => {
    console.log('Setting external token');
    if (selectedPlan?.memeCk) {
      setExternalSessionToken();
    }
  }, [selectedPlan?.memeCk]);

  const breadcrumbs = pathname
    .split('/')
    .filter(Boolean)
    .map((item) => appPaths.get(item.toLowerCase())!)
    .filter(Boolean);

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
            <Link className="ml-5 lg:px-0" href="/member/home">
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
            {selectedProfile?.type != UserRole.NON_MEM && plans.length > 1 && (
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
            icon={<Image src={profileWhiteIcon} alt=""></Image>}
            items={
              selectedPlan
                ? selectedPlan.termedPlan
                  ? [
                      {
                        title: 'Inbox',
                        label: 'inbox',
                        icon: <Image src={inboxIcon} alt="" />,
                        url: '/member/inbox',
                      },
                    ]
                  : [
                      {
                        title: 'Inbox',
                        label: 'inbox',
                        icon: <Image src={inboxIcon} alt="" />,
                        url: '/member/inbox',
                      },
                      {
                        title: 'ID Card',
                        label: 'id card',
                        icon: <Image src={globalIdCardIcon} alt="" />,
                        url: '/member/idcard',
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
            className={`fixed top-[72px] h-full md:h-fit shadow-lg transition-transform duration-300 ease-in-out lg:block w-full md:w-1/2 lg:w-full bg-white z-20 ${activeSubNavId !== null ? 'block' : 'hidden'}`}
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
                      titleLink={page.titleLink}
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
              {/* 
              <AlertBar
                alerts={
                  (process.env.NEXT_PUBLIC_ALERTS?.length ?? 0) > 0
                    ? (process.env.NEXT_PUBLIC_ALERTS?.split(';') ?? [])
                    : []
                }
              />
              */}
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
      {/* breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="flex flex-col justify-center items-center page">
          <div className="app-content">
            <BreadCrumb items={breadcrumbs} />
          </div>
        </div>
      )}
      {/* Session idle timer */}
      {isLoggedIn && <SessionIdleTimer />}
    </>
  );
}
