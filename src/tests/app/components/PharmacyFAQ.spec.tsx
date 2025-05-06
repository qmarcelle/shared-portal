import { PharmacyFAQ } from '@/app/(protected)/(common)/member/pharmacy/components/PharmacyFAQ';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Image from 'next/image';

const renderUI = () => {
  return render(
    <PharmacyFAQ
      serviceTitle="Help with Prescription Drugs"
      className="large-section"
      services={[
        {
          serviceLabel: 'How can I find out which drugs my plan covers?',
          answerline1: (
            <RichText
              className="manage-image"
              spans={[
                <span key={0}>
                  To see a list of all the prescription drugs your plan covers,
                  go to the{' '}
                </span>,
                <span className="link" key={1}>
                  <a>Check Drug Cost & Coverage page</a>
                  <Image src={externalIcon} alt="external Icon" />{' '}
                </span>,
                <span key={2}> on your caremark.com account.</span>,
              ]}
            />
          ),
          answerline2: 'You can also view or download a pdf formulary.',
        },
        {
          serviceLabel: 'How do I get a prior authorization?',
          answerline1:
            'If your doctor prescribes a drug that needs a prior authorization, they’ll ask us for one when they write your prescription. We’ll review the case, make sure the drug is appropriate and safe, and make a decision. If it’s approved, we’ll send you a letter to let you know. Then you’ll be able to get your drugs from the pharmacy. ',
          answerline2: '',
        },
        {
          serviceLabel: 'What is a specialty medication?',
          answerline1:
            'Specialty medications are expensive drugs that usually treat complex conditions. Some specialty drugs can be delivered to your home, but some of them have to be taken at the doctor’s office.',
          answerline2: '',
        },
        {
          serviceLabel: 'How do I know if a drug is a specialty drug?',
          answerline1:
            'Specialty drugs are typically on higher tiers like 4 or 5 and usually need prior authorizations. They can also have special handing requirements, like temperature control, too. Some specialty drugs are only available at certain pharmacies. Many specialty drugs have coupons that can help you save money on your copay or coinsurance. ',
          answerline2: '',
        },
        {
          serviceLabel: 'How can I save money on my prescriptions?',
          answerline1: (
            <RichText
              className="manage-image"
              spans={[
                <span key={0}>
                  One way you could save is to use the drug price comparison
                  tool. You can compare the prices of the drugs you’re currently
                  taking with other drugs that may work as well, including
                  generic drugs, which can cost much less than brand-name drugs.
                  Go to the{' '}
                </span>,
                <span className="link" key={1}>
                  <a>Check Drug Cost & Coverage page</a>
                  <Image src={externalIcon} alt="external Icon" />{' '}
                </span>,
                <span key={2}> on your caremark.com account.</span>,
              ]}
            />
          ),

          answerline2: (
            <RichText
              className="manage-image"
              spans={[
                <span key={0}>
                  You can also sign up for 90-day fills of some drugs via mail,
                  which can save you time and money compared to picking up
                  smaller amounts every month. To start getting your
                  prescriptions by mail, go to the{' '}
                </span>,
                <span className="link" key={1}>
                  <a>Start Rx Delivery by Mail page</a>
                  <Image src={externalIcon} alt="external Icon" />{' '}
                </span>,
                <span key={2}>
                  on your caremark.com account. CVS Caremark Mail Service
                  Pharmacy will fill your order and let you know when it will
                  arrive.
                </span>,
              ]}
            />
          ),
        },
      ]}
    />,
  );
};

describe('ServicesRenderedSection', () => {
  it('should render the UI correctly', async () => {
    const component = renderUI();
    expect(
      screen.getByText('Help with Prescription Drugs'),
    ).toBeInTheDocument();
    expect(
      screen.getByText('How can I find out which drugs my plan covers?'),
    ).toBeInTheDocument();

    screen.getByText('How can I find out which drugs my plan covers?');
    let pharmacyFaqContent = screen.queryByText(
      'To see a list of all the prescription drugs your plan covers, go to the',
    );
    expect(pharmacyFaqContent).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByText('How can I find out which drugs my plan covers?'),
    ); //check that body text is visible after clicking
    pharmacyFaqContent = screen.getByText(
      'To see a list of all the prescription drugs your plan covers, go to the',
    );
    expect(pharmacyFaqContent).toBeInTheDocument();

    fireEvent.click(
      screen.getByText('How can I find out which drugs my plan covers?'),
    ); //check that it is not visible after clicking again
    pharmacyFaqContent = screen.queryByText(
      'To see a list of all the prescription drugs your plan covers, go to the',
    );
    expect(pharmacyFaqContent).not.toBeInTheDocument();

    expect(component).toMatchSnapshot();
  });
});
