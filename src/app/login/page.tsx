'use client';

import { Column } from '@/components/foundation/Column';
import { LoginComponent } from './components/LoginComponent';
import { MfaComponent } from './components/MfaComponent';
import Image from 'next/image';
import { LoginGenericErrorcomponent } from './components/LoginGenericErrorcomponent';
import { useLoginStore } from './stores/loginStore';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import { useRouter } from 'next/navigation';

export default function LogIn() {
  const [unhandledErrors, loggedUser, mfaNeeded, backToHome] = useLoginStore(
    (state) => [
      state.unhandledErrors,
      state.loggedUser,
      state.mfaNeeded,
      state.resetToHome,
    ],
  );

  const router = useRouter();
  function renderComp() {
    if (unhandledErrors == true) {
      return <LoginGenericErrorcomponent />;
    }
    if (loggedUser == true) {
      router.replace('/dashboard');
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
              onClick={backToHome}
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
