'use client';

import { Column } from '@/components/foundation/Column';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import { DEFAULT_LOGIN_REDIRECT } from '@/utils/routes';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { LoginComponent } from './components/LoginComponent';
import { LoginGenericErrorcomponent } from './components/LoginGenericErrorcomponent';
import { MfaComponent } from './components/MfaComponent';
import { MultipleAttemptsErrorComponent } from './components/MultipleAttemptsErrorComponent';
import { useLoginStore } from './stores/loginStore';

export default function LogIn() {
  const [unhandledErrors, loggedUser, mfaNeeded, multipleLoginAttempts] =
    useLoginStore((state) => [
      state.unhandledErrors,
      state.loggedUser,
      state.mfaNeeded,
      state.multipleLoginAttempts,
    ]);

  const router = useRouter();
  function renderComp() {
    if (unhandledErrors == true) {
      return <LoginGenericErrorcomponent />;
    }
    if (loggedUser == true) {
      router.replace(DEFAULT_LOGIN_REDIRECT);
    }
    if (multipleLoginAttempts == true) {
      return <MultipleAttemptsErrorComponent />;
    }
    if (mfaNeeded == false) {
      return <LoginComponent />;
    } else {
      return <MfaComponent />;
    }
  }

  return (
    <div>
      <header>
        <Column>
          <div className="flow-root">
            <a className="float-left" href="https://www.bcbst.com">
              <Image
                src={bcbstBlueLogo}
                id="logo"
                alt="Blue Cross Blue Shield of Tennessee"
              ></Image>
            </a>
            <a className="float-right" href="https://www.bcbst.com/contact-us">
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
