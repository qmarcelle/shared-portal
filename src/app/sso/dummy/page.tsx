'use client';
import Link from 'next/link';
import {
  BLUE_365_FITNESS,
  BLUE_365_FOOTWEAR,
  BLUE_365_HEARING_VISION,
  BLUE_365_HOME_FAMILY,
  BLUE_365_NUTRITION,
  BLUE_365_PERSONAL_CARE,
  BLUE_365_TRAVEL,
  CVS_DRUG_SEARCH_INIT,
  CVS_PHARMACY_SEARCH_FAST,
  CVS_REFILL_RX,
  EYEMED_PROVIDER_DIRECTORY,
  EYEMED_VISION,
  PROV_DIR_DENTAL,
  PROV_DIR_MEDICAL,
  PROV_DIR_MENTAL_HEALTH,
  PROV_DIR_VISION,
} from '../ssoConstants';

const DummyPage = () => {
  return (
    <div>
      <h1>SSO Redirect Links</h1>
      <br />
      <ul>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CHIP_REWARDS}`}
          >
            CHIP REWARDS
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}`}
          >
            EYEMED
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&target=${EYEMED_VISION}`}
          >
            EYEMED Vision
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EYEMED}&target=${EYEMED_PROVIDER_DIRECTORY}`}
          >
            EYEMED Eye Doctor
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_HEALTH_EQUITY}`}
          >
            Health Equity
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_EMBOLD}`}
          >
            Embold
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}`}
          >
            CVS Caremark
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&target=${CVS_DRUG_SEARCH_INIT}`}
          >
            CVS Caremark Drug Search
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&target=${CVS_PHARMACY_SEARCH_FAST}`}
          >
            CVS Caremark Pharmacy Search
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK}&target=${CVS_REFILL_RX}`}
          >
            CVS Caremark Refill RX
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_TELADOC}`}
          >
            Teladoc
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PINNACLE_BANK}`}
          >
            Pinnacle Bank
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_HSA_BANK}`}
          >
            HSA Bank
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}`}
          >
            ON Life
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}&target=Challenge`}
          >
            ON Life Challenge
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ON_LIFE}&target='PHA'`}
          >
            ON Life PHA
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}`}
          >
            Blue 365
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_FOOTWEAR}`}
          >
            Blue 365 FootWear
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_FITNESS}`}
          >
            Blue 365 Fitness
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_HEARING_VISION}`}
          >
            Blue 365 Hearing & Vision
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_HOME_FAMILY}`}
          >
            Blue 365 Home & Family
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_NUTRITION}`}
          >
            Blue 365 Nutrition
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_PERSONAL_CARE}`}
          >
            Blue 365 Personal Care
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_BLUE_365}&target=${BLUE_365_TRAVEL}`}
          >
            Blue 365 Travel
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH}`}
          >
            Premise Health
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PREMISE_HEALTH}&target=schedule`}
          >
            Premise Health Schedule
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}`}
          >
            Provider Directory
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&target=${PROV_DIR_MEDICAL}`}
          >
            Provider Directory Medical
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&target=${PROV_DIR_DENTAL}`}
          >
            Provider Directory Dental
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&target=${PROV_DIR_VISION}`}
          >
            Provider Directory Vision
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&target=${PROV_DIR_MENTAL_HEALTH}`}
          >
            Provider Directory Mental Health
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&isPCPSearchRedirect=true`}
          >
            Provider Directory PCP Search
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&redirectLink=PCPSearchRedirect`}
          >
            Provider Directory Redirect Link
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_INSTAMED}&claimId=EXT820200100&claimType=M`}
          >
            Instamed
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_INSTAMED}&alternateText=Instamed Payment History&isInstamedPaymentHistory=true`}
          >
            Instamed Payment History
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_VITALSPRP}&provId=4165326`}
          >
            Vitals PRP
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA}`}
          >
            Electronic Payment BOA
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_M3P}`}
          >
            M3P
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DummyPage;
