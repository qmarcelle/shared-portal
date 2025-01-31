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
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PCA}`}
          >
            PCA
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
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_MDLIVE}`}
          >
            MD LIVE
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
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_INSTAMED_PAYMENT_HISTORY}`}
          >
            Instamed Payment History
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_OHD}`}
          >
            OHD
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
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_LIVONGO}`}
          >
            LIVONGO
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_PROVIDER_DIRECTORY}&PCPSearchRedirect=PCPSearchRedirect`}
          >
            Provider Directory
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_INSTAMED}`}
          >
            Instamed
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_VITALSPRP}`}
          >
            Vitals PRP
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ESI}`}
          >
            ESI
          </Link>
        </li>
        <li>
          <Link
            href={`/sso/launch?PartnerSpId=${process.env.NEXT_PUBLIC_IDP_ELECTRONIC_PAYMENT_BOA}`}
          >
            Electronic Payment BOA
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DummyPage;
