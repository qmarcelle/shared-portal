'use client';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import { noHeaderAndFooterRoutes } from '@/utils/routes';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Column } from './Column';
import {
  bcbstnLogo,
  facebookLogo,
  instagramLogo,
  linkedinLogo,
  pintrestLogo,
  xLogo,
  youtubeLogo,
} from './Icons';
import { Row } from './Row';
// Define TypeScript interface for any props if needed in the future
interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
  const currentYear = new Date().getFullYear();
  const currentPath =
    typeof window !== 'undefined' ? window.location.pathname : '';
  const specificPages = ['/member/amplifyhealthsupport'];

  const isSpecificPage = specificPages.includes(currentPath);
  const trackLinkAnalytics = (clickText: string, clickUrl: string) => {
    const analytics: AnalyticsData = {
      click_text: clickText.toLowerCase(),
      click_url: clickUrl,
      event: 'navigation',
      site_section: 'Footer',
    };
    googleAnalytics(analytics);
  };

  if (noHeaderAndFooterRoutes.includes(currentPath)) {
    return null; // Do not render the Footer on these pages
  }
  return (
    <footer>
      <section
        role="contentinfo"
        className={
          isSpecificPage ? 'surface-gradient-amplify' : 'brand-gradient'
        }
      >
        <Column className="md:text-left text-center app-content container mx-auto grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_29%] lg:grid-cols-[1fr_1fr_1fr_40%] gap-4 md:gap-x-8 text-sm text-white min-h-[216px]">
          {/* Popular Links Section */}
          <Column>
            <h3 className="body-bold mb-4">Popular Links</h3>
            <ul className="space-y-4 font-thin body-2">
              <li>
                <Link
                  href="/member/idcard"
                  onClick={() =>
                    trackLinkAnalytics('Get an ID Card', '/member/idcard')
                  }
                >
                  Get an ID Card
                </Link>
              </li>
              <li>
                <Link
                  href="/member/findcare"
                  onClick={() =>
                    trackLinkAnalytics('Find Care & Costs', '/member/findcare')
                  }
                >
                  Find Care & Costs
                </Link>
              </li>
              <li>
                <Link
                  href="/member/myplan/claims"
                  onClick={() =>
                    trackLinkAnalytics('View Claims', '/member/myplan/claims')
                  }
                >
                  View Claims
                </Link>
              </li>
              <li>
                <Link
                  href="/member/profile"
                  onClick={() =>
                    trackLinkAnalytics('Profile Settings', '/member/profile')
                  }
                >
                  Profile Settings
                </Link>
              </li>
            </ul>
          </Column>

          {/* Support Section */}
          <Column>
            <h3 className="body-bold mb-4">Support</h3>
            <ul className="space-y-4 body-2 font-thin">
              <li>
                <Link
                  href="/member/support"
                  onClick={() =>
                    trackLinkAnalytics(
                      'Get Help & Contact Us',
                      '/member/support',
                    )
                  }
                >
                  Get Help & Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="http://wn008422.bcbst.com:81/portal/portal_refresh1/index.html#987736460"
                  onClick={() =>
                    trackLinkAnalytics(
                      'Share Website Feedback',
                      'http://wn008422.bcbst.com:81/portal/portal_refresh1/index.html#987736460',
                    )
                  }
                >
                  Share Website Feedback
                </Link>
              </li>
              <li>
                <Link
                  href="http://wn008422.bcbst.com:81/portal/portal_feature_cobrowse/index.html#988880562"
                  onClick={() =>
                    trackLinkAnalytics(
                      'Share Your Screen',
                      'http://wn008422.bcbst.com:81/portal/portal_feature_cobrowse/index.html#988880562',
                    )
                  }
                >
                  Share Your Screen
                </Link>
              </li>
            </ul>
          </Column>

          {/* Important Information Section */}
          <Column>
            <h3 className="body-bold mb-4">Important Information</h3>
            <ul className="space-y-4 body-2 font-thin">
              <li>
                <Link
                  href="https://www.bcbst.com/about/our-company/corporate-governance/legal/nondiscrimination-notice"
                  onClick={() =>
                    trackLinkAnalytics(
                      'Nondiscrimination',
                      'https://www.bcbst.com/about/our-company/corporate-governance/legal/nondiscrimination-notice',
                    )
                  }
                >
                  Nondiscrimination
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.bcbst.com/use-insurance/member-rights"
                  onClick={() =>
                    trackLinkAnalytics(
                      'Member Rights',
                      'https://www.bcbst.com/use-insurance/member-rights',
                    )
                  }
                >
                  Member Rights
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.bcbst.com/fraud"
                  onClick={() =>
                    trackLinkAnalytics(
                      'Fight Fraud',
                      'https://www.bcbst.com/fraud',
                    )
                  }
                >
                  Fight Fraud
                </Link>
              </li>
            </ul>
          </Column>

          {/* Download the App Section */}
          <Column className="md:ml-16 p-7 md:p-0 text-left">
            <Row className="md:block lg:flex">
              <Image className="" src={bcbstnLogo} alt="" />

              <Column className="ml-4 md:ml-0 lg:ml-4 mt-1">
                <h3 className="body-bold mb-2">Download the App</h3>
                <p className="body-2">
                  Download the BCBSTN app in the Apple Store or Google Play.
                </p>
              </Column>
            </Row>
            <Row className="flex mt-4 grid grid-cols-6 md:grid-cols-3 md:grid-rows-2 lg:grid-cols-6 md:mb-2 mb-0 lg:mb-0 gap-x-2 gap-y-4">
              {/* Social Media Icons */}
              <a
                href="https://www.facebook.com/bcbst"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkAnalytics(
                    'Facebook',
                    'https://www.facebook.com/bcbst',
                  )
                }
              >
                <Image
                  width={35}
                  height={35}
                  src={facebookLogo}
                  alt="Facebook Icon"
                />
              </a>
              <a
                href="https://www.linkedin.com/company/bcbst"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkAnalytics(
                    'LinkedIn',
                    'https://www.linkedin.com/company/bcbst',
                  )
                }
              >
                <Image
                  width={35}
                  height={35}
                  src={linkedinLogo}
                  alt="Linkedin Icon"
                />
              </a>
              <a
                href="https://www.instagram.com/bcbst/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkAnalytics(
                    'Instagram',
                    'https://www.instagram.com/bcbst/?hl=en',
                  )
                }
              >
                <Image
                  width={35}
                  height={35}
                  src={instagramLogo}
                  alt="Instagram Icon"
                />
              </a>
              <a
                href="https://www.youtube.com/@bcbstennessee/shorts"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkAnalytics(
                    'YouTube',
                    'https://www.youtube.com/@bcbstennessee/shorts',
                  )
                }
              >
                <Image
                  width={35}
                  height={35}
                  src={youtubeLogo}
                  alt="Youtube Icon"
                />
              </a>
              <a
                href="https://www.pinterest.com/bcbst/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkAnalytics(
                    'Pinterest',
                    'https://www.pinterest.com/bcbst/',
                  )
                }
              >
                <Image
                  width={35}
                  height={35}
                  src={pintrestLogo}
                  alt="Pinterest Icon"
                />
              </a>
              <a
                href="https://twitter.com/bcbst"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackLinkAnalytics('X', 'https://twitter.com/bcbst')
                }
              >
                <Image width={35} height={35} src={xLogo} alt="X Icon" />
              </a>
            </Row>
          </Column>
        </Column>
      </section>
      <section className="bg-neutral text-white text-xs">
        <Column className="app-content container mx-auto text-center space-y-8 mb-[72px]">
          <Row className="flex flex-wrap justify-center gap-2 body-2">
            <Link href="">Español</Link>
            <span>|</span>
            <Link href="">العربية</Link>
            <span>|</span>
            <Link href="">繁體中文</Link>
            <span>|</span>
            <Link href="">Tiếng Việt</Link>
            <span>|</span>
            <Link href="">한국어</Link>
            <span>|</span>
            <Link href="">Français</Link>
            <span>|</span>
            <Link href="">ພາສາລາວ</Link>
            <span>|</span>
            <Link href="">Deutsch</Link>
            <span>|</span>
            <Link href="">ગુજરાતી</Link>
            <span>|</span>
            <Link href="">日本語</Link>
            <span>|</span>
            <Link href="">Tagalog</Link>
            <span>|</span>
            <Link href="">हिंदी</Link>
            <span>|</span>
            <Link href="">Русский</Link>
            <span>|</span>
            <Link href="">فارسی</Link>
            <span>|</span>
            <Link href="">Kreyòl Ayisyen</Link>
            <span>|</span>
            <Link href="">Polski</Link>
            <span>|</span>
            <Link href="">Português</Link>
            <span>|</span>
            <Link href="">Italiano</Link>
            <span>|</span>
            <Link href="">Diné Bizaad</Link>
            <span>|</span>
            <Link href="">Deitsch</Link>
            <span>|</span>
            <Link href="">Gagana Samoa</Link>
            <span>|</span>
            <Link href="">Kapasal Falawasch</Link>
            <span>|</span>
            <Link href="">Chamoru</Link>
          </Row>

          <Row className="mt-8 border-t border-text-white flex-col-reverse lg:flex-row pt-4 flex lg:justify-between space-y-2 md:space-y-0 lg:pb-4 body-2">
            <Column className="lg:w-[67%] lg:text-left mt-4">
              ©1998-{currentYear} BlueCross BlueShield of Tennessee, Inc., an
              Independent Licensee of the Blue Cross Blue Shield Association.
              BlueCross BlueShield of Tennessee is a Qualified Health Plan
              issuer in the Health Insurance Marketplace. 1 Cameron Hill Circle,
              Chattanooga TN 37402-0001
            </Column>
            <Row className="space-x-4 body-2 !mt-4 lg:text-left justify-center">
              <Link href="" onClick={() => trackLinkAnalytics('Sitemap', '')}>
                Sitemap
              </Link>
              <span>|</span>
              <Link
                href="https://www.bcbst.com/about/our-company/corporate-governance/privacy-security"
                onClick={() =>
                  trackLinkAnalytics(
                    'Privacy & Security',
                    'https://www.bcbst.com/about/our-company/corporate-governance/privacy-security',
                  )
                }
              >
                Privacy & Security
              </Link>
              <span>|</span>
              <Link
                href="https://www.bcbst.com/about/our-company/corporate-governance/legal"
                onClick={() =>
                  trackLinkAnalytics(
                    'Legal',
                    'https://www.bcbst.com/about/our-company/corporate-governance/legal',
                  )
                }
              >
                Legal
              </Link>
            </Row>
          </Row>
        </Column>
      </section>
    </footer>
  );
};

export default Footer;
