import { Column } from '@/components/foundation/Column';
import { bcbstBlueLogo } from '@/components/foundation/Icons';
import Image from 'next/image';

export default function LoginLoading() {
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
          </div>
        </Column>
      </header>
      <section>
        <div id="blueback">
          <div id="marginSection" className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
