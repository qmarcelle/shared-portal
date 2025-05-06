'use client';

import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import { Loader } from '@/components/foundation/Loader';
import { Spacer } from '@/components/foundation/Spacer';

const DashboardLoader = () => {
  return (
    <div className="flex flex-col w-full justify-center items-center page ">
      <div
        className={
          'flex flex-col h-175px w-full justify-center items-center brand-gradient px-4 min-h-[250px]'
        }
      >
        <div className="flex flex-col items-start w-full app-content px-4">
          <div className="card-main welcomeBannerLoader w-[50%]">
            <Loader items={6} />
          </div>
        </div>
      </div>

      <Column className="app-content app-base-font-color">
        <Spacer size={32}></Spacer>
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <Card className="large-section">
              <div className="flex flex-col">
                <Loader items={10} />
              </div>
            </Card>
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch hidden md:block">
            <Card className="large-section">
              <div className="flex flex-col">
                <Loader items={10} />
              </div>
            </Card>
          </Column>
        </section>
      </Column>
    </div>
  );
};
export default DashboardLoader;
