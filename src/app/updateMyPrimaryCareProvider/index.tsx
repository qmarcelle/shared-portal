'use client';

import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Row } from '@/components/foundation/Row';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { FilterItem } from '@/models/filter_dropdown_details';
import { PrintedRequestForm } from './components/PrintedRequestForm';
import { ProviderDirectory } from './components/ProviderDirectory';
import { SendEmailRequest } from './components/SendEmailRequest';
type UpdateMyPrimaryCareProviderProps = {
  filters: FilterItem[];
};
const UpdateMyPrimaryCareProvider = ({
  filters,
}: UpdateMyPrimaryCareProviderProps) => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color mt-20">
        <Header
          text="Update My Primary Care Provider"
          className="m-4 mb-0 !font-light !text-[32px]/[40px]"
        />
        <Spacer size={12} />
        <TextBox
          className="md:w-2/3 m-4"
          text="Choose one option below and follow the instructions to add or update your primary care provider."
        />
        <section id="Filter" className="updateMyPrimaryCareW">
          <div className="flex flex-col justify-center items-center page">
            <Column className="app-content app-base-font-color">
              <Row>
                <ProviderDirectory />
              </Row>
              <Row className="md:!flex !block">
                <Column className="md:w-1/2 w-auto">
                  <SendEmailRequest filters={filters} />
                </Column>
                <Column className="md:w-1/2 w-auto">
                  <PrintedRequestForm />
                </Column>
              </Row>
            </Column>
          </div>
        </section>
      </Column>
    </main>
  );
};

export default UpdateMyPrimaryCareProvider;
