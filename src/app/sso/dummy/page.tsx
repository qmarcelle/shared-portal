'use client';
import Link from 'next/link';

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
