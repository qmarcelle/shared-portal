'use client';

import { Column } from '@/components/foundation/Column';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import { AnalyticsData } from '@/models/app/analyticsData';
import { googleAnalytics } from '@/utils/analytics';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { EmailUniquenessVerification } from './components/EmailUniquenessVerification';
import { LoginComponent } from './components/LoginComponent';
import { LoginEmailVerification } from './components/LoginEmailVerification';
import { LoginGenericErrorcomponent } from './components/LoginGenericErrorcomponent';
import { MfaComponent } from './components/MfaComponent';
import { MFASecurityCodeMultipleAttemptComponent } from './components/MFASecurityCodeMultipleAttemptComponent';
import { MultipleAttemptsErrorComponent } from './components/MultipleAttemptsErrorComponent';
import { ResetPasswordComponent } from './components/ResetPasswordComponent';
import { useLoginStore } from './stores/loginStore';
import { useMfaStore } from './stores/mfaStore';

export default function LogIn() {
  const [
    unhandledErrors,
    loggedUser,
    mfaNeeded,
    multipleLoginAttempts,
    isRiskScoreHigh,
    riskLevelNotDetermined,
    verifyEmail,
    forcedPasswordReset,
    emailUniqueness,
    verifyUniqueEmail,
  ] = useLoginStore((state) => [
    state.unhandledErrors,
    state.loggedUser,
    state.mfaNeeded,
    state.multipleLoginAttempts,
    state.isRiskScoreHigh,
    state.riskLevelNotDetermined,
    state.verifyEmail,
    state.forcedPasswordReset,
    state.emailUniqueness,
    state.verifyUniqueEmail,
  ]);
  const [multipleMFASecurityCodeAttempts] = useMfaStore((state) => [
    state.multipleMFASecurityCodeAttempts,
  ]);

  const router = useRouter();
  const queryParams = useSearchParams();
  function renderComp() {
    if (unhandledErrors == true) {
      return <LoginGenericErrorcomponent />;
    }
    if (loggedUser == true) {
      router.replace(
        queryParams.get('TargetResource') ||
          process.env.NEXT_PUBLIC_LOGIN_REDIRECT_URL ||
          '/security',
      );
    }
    if (multipleLoginAttempts == true) {
      return <MultipleAttemptsErrorComponent />;
    }
    if (isRiskScoreHigh == true || riskLevelNotDetermined == true) {
      router.replace(process.env.NEXT_PUBLIC_PORTAL_ERROR_URL ?? '');
    }
    if (multipleMFASecurityCodeAttempts == true) {
      return <MFASecurityCodeMultipleAttemptComponent />;
    }
    if (forcedPasswordReset == true) {
      return <ResetPasswordComponent />;
    }
    if (verifyEmail == true || verifyUniqueEmail == true) {
      return <LoginEmailVerification />;
    }
    if (emailUniqueness == true) {
      return <EmailUniquenessVerification />;
    }
    if (mfaNeeded == false) {
      return <LoginComponent />;
    } else {
      return <MfaComponent />;
    }
  }

  const trackContactUsAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'contact us',
      click_url: process.env.NEXT_PUBLIC_PORTAL_CONTACT_US_URL,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };

  const trackBackToHomeAnalytics = () => {
    const analytics: AnalyticsData = {
      click_text: 'back to homepage',
      click_url: process.env.NEXT_PUBLIC_PORTAL_URL,
      element_category: 'content interaction',
      action: 'click',
      event: 'internal_link_click',
      content_type: undefined,
    };
    googleAnalytics(analytics);
  };

  return (
    <div>
      <header>
        <title>Member Login</title>
        <Column>
          <div className="flow-root">
            <a className="float-left" href="https://www.bcbst.com">
              <Image
                src={bcbstBlueLogo}
                id="logo"
                alt="Blue Cross Blue Shield of Tennessee"
              ></Image>
            </a>
            <a
              className="float-right"
              tabIndex={-1}
              href="https://www.bcbst.com/contact-us"
              onClick={trackContactUsAnalytics}
            >
              <button className="buttonlink headerbutton" id="contactbutton">
                Contact Us
              </button>
            </a>
          </div>
        </Column>
      </header>
      <section>
        <div id="blueback">
          <div id="marginSection">
            <button
              onClick={() => {
                trackBackToHomeAnalytics();
                router.replace(process.env.NEXT_PUBLIC_PORTAL_URL ?? '');
              }}
              id="backButton"
              className="buttonlink pt-9"
            >
              Back to Homepage
            </button>
            {renderComp()}
          </div>
        </div>
      </section>
    </div>
  );
}
