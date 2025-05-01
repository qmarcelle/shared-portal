'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
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
  const currentYear = new Date().getFullYear(); // Gets the current year
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);
  const specificPages = ['/amplifyHealthSupport'];
  const isSpecificPage = specificPages.includes(pathname);
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
                <Link href="/memberIDCard">Get an ID Card</Link>
              </li>
              <li>
                <Link href="/findcare">Find Care & Costs</Link>
              </li>
              <li>
                <Link href="/claims">View Claims</Link>
              </li>
              <li>
                <Link href="/profileSettings">Profile Settings</Link>
              </li>
            </ul>
          </Column>

          {/* Support Section */}
          <Column>
            <h3 className="body-bold mb-4">Support</h3>
            <ul className="space-y-4 body-2 font-thin">
              <li>
                <Link href="/support">Get Help & Contact Us</Link>
              </li>
              <li>
                <Link href="">Share Website Feedback</Link>
              </li>
              <li>
                <Link href="">Share Your Screen</Link>
              </li>
            </ul>
          </Column>

          {/* Important Information Section */}
          <Column>
            <h3 className="body-bold mb-4">Important Information</h3>
            <ul className="space-y-4 body-2 font-thin">
              <li>
                <Link href="">Nondiscrimination</Link>
              </li>
              <li>
                <Link href="">Member Rights</Link>
              </li>
              <li>
                <Link href="">Fight Fraud</Link>
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
              <Image
                width={35}
                height={35}
                src={facebookLogo}
                alt="Facebook Icon"
              />
              <Image
                width={35}
                height={35}
                src={linkedinLogo}
                alt="Linkedin Icon"
              />
              <Image
                width={35}
                height={35}
                src={instagramLogo}
                alt="Instagram Icon"
              />
              <Image
                width={35}
                height={35}
                src={youtubeLogo}
                alt="Youtube ICon"
              />
              <Image
                width={35}
                height={35}
                src={pintrestLogo}
                alt="Pintrest Icon"
              />
              <Image width={35} height={35} src={xLogo} alt="X Icon" />
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
              <Link href="">Sitemap</Link>
              <span>|</span>
              <Link href="">Privacy & Security</Link>
              <span>|</span>
              <Link href="">Legal</Link>
            </Row>
          </Row>
        </Column>
      </section>
    </footer>
  );
};

export default Footer;
