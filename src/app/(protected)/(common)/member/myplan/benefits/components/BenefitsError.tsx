import { Column } from '@/components/foundation/Column';
import { Header } from '@/components/foundation/Header';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';

export const BenefitsError = () => {
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <Column className="app-content app-base-font-color">
              <Header text={'Sorry, something went wrong.'} />
              <Spacer size={16} />
              <TextBox
                className="body-1"
                text={
                  'There was a problem loading your benefit information. Please try again later.'
                }
              ></TextBox>
            </Column>
          </Column>
        </section>
      </Column>
    </main>
  );
};
