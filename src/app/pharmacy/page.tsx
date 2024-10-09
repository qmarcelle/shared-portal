'use client';

import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import {
  downloadIcon,
  externalIcon,
  rightIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { PharmacyDocuments } from './components/PharmacyDocuments';
import { PharmacyFAQ } from './components/PharmacyFAQ';

const Pharmacy = () => {
  const router = useRouter();
  //To Do Remove Below EsLint once integrated with API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redirectToPharmacyClaims = (claimId: string) => {
    router.push('/pharmacy/pharmacyClaims');
  };
  return (
    <main className="flex flex-col justify-center items-center page">
      <Column className="app-content app-base-font-color">
        <section className="flex flex-row items-start app-body"></section>
        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-63_33 items-stretch">
            <RecentClaimSection
              className="large-section"
              title="My Recent Pharmacy Claims"
              linkText="View All Pharmacy Claims"
              linkCallBack={() => {
                router.push('/claimSnapshotList');
              }}
              claims={[
                {
                  id: 'Claim01',
                  claimStatus: 'Processed',
                  claimType: 'Pharmacy',
                  claimTotal: '50.00',
                  issuer: '123 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '08/10/2023',
                  claimInfo: {},
                  isMiniCard: true,
                  callBack: (claimId: string) => {
                    redirectToPharmacyClaims(claimId);
                  },
                },
                {
                  id: 'Claim02',
                  claimStatus: 'Denied',
                  claimType: 'Pharmacy',
                  claimTotal: '403.98',
                  issuer: '565 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '07/05/2023',
                  claimInfo: {},
                  isMiniCard: true,
                  callBack: (claimId: string) => {
                    redirectToPharmacyClaims(claimId);
                  },
                },
                {
                  id: 'Claim03',
                  claimStatus: 'Pending',
                  claimType: 'Pharmacy',
                  claimTotal: '33.00',
                  issuer: '890 Pharmacy',
                  memberName: 'Chris Hall',
                  serviceDate: '12/22/2022',
                  claimInfo: {},
                  isMiniCard: true,
                  callBack: (claimId: string) => {
                    redirectToPharmacyClaims(claimId);
                  },
                },
              ]}
            />
          </Column>
          <Column className=" flex-grow page-section-36_67 items-stretch">
            <></>
          </Column>
        </section>

        <Spacer size={32} />
        <section className="flex flex-row items-start app-body">
          <Column className="flex-grow page-section-36_67 items-stretch">
            <Card className="large-section flex flex-row items-start app-body ">
              <Column>
                <TextBox type="title-2" text="Pharmacy Documents & Forms" />
                <Spacer size={21} />
                <PharmacyDocuments
                  linkDetails={[
                    {
                      linkTitle: 'View Covered Drug List (Formulary)',
                      linkDescription:
                        'Download a list of all the drugs your plan covers.',
                      linkURL: 'http://www.bcbst.com/docs/pharmacy/go-510.pdf',
                      linkIcon: (
                        <Image
                          src={downloadIcon}
                          alt="download Icon"
                          className="inline"
                        />
                      ),
                    },
                    {
                      linkTitle: 'Prescription Drug Claim Form',
                      linkDescription:
                        "We call it the G0-510 form. You'll use it only for prescription drug claims when the claim is not filled through your pharmacist.",
                      linkURL: 'http://www.bcbst.com/docs/pharmacy/go-510.pdf',
                      linkIcon: (
                        <Image
                          src={downloadIcon}
                          alt="download Icon"
                          className="inline"
                        />
                      ),
                    },
                    {
                      linkTitle: 'Prescription Mail Service Order Form',
                      linkDescription:
                        'Mail order is easy and convenient. You can have your prescriptions delivered right to your home.',
                      linkIcon: (
                        <Image
                          src={downloadIcon}
                          alt="download Icon"
                          className="inline"
                        />
                      ),
                    },
                    {
                      linkTitle:
                        'Request for Medicare Prescription Drug Coverage Determination',
                      linkDescription:
                        'You can request an exception for prescription drug coverage.',
                      linkIcon: (
                        <Image
                          src={rightIcon}
                          alt="right arrow Icon"
                          className="inline"
                        />
                      ),
                    },
                    {
                      linkTitle:
                        'Request for Redetermination of Medicare Prescription Drug Denial',
                      linkDescription:
                        'If you received a Notice of Denial of Medicare Prescription Drug Coverage, you can ask us for a redetermination (appeal).',
                      linkIcon: (
                        <Image
                          src={rightIcon}
                          alt="right arrow Icon"
                          className="inline"
                        />
                      ),
                    },
                  ]}
                />
              </Column>
            </Card>
          </Column>
          <Column className=" flex-grow page-section-63_33 items-stretch">
            <Card className="large-section flex flex-row items-start app-body ">
              <Column>
                <TextBox type="title-2" text="Pharmacy FAQ" />
                <Spacer size={32} />
                <section className="flex flex-row items-start app-body">
                  <Column className="flex-grow">
                    <PharmacyFAQ
                      serviceTitle="Help with Prescription Drugs"
                      className="large-section"
                      services={[
                        {
                          serviceLabel:
                            'How can I find out which drugs my plan covers?',
                          answerline1: (
                            <RichText
                              className="manage-image"
                              spans={[
                                <span key={0}>
                                  To see a list of all the prescription drugs
                                  your plan covers, go to the{' '}
                                </span>,
                                <span className="link" key={1}>
                                  <a>Check Drug Cost & Coverage page</a>
                                  <Image
                                    src={externalIcon}
                                    alt="external Icon"
                                  />{' '}
                                </span>,
                                <span key={2}>
                                  {' '}
                                  on your caremark.com account.
                                </span>,
                              ]}
                            />
                          ),
                          answerline2:
                            'You can also view or download a pdf formulary.',
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
                          serviceLabel:
                            'How do I know if a drug is a specialty drug?',
                          answerline1:
                            'Specialty drugs are typically on higher tiers like 4 or 5 and usually need prior authorizations. They can also have special handing requirements, like temperature control, too. Some specialty drugs are only available at certain pharmacies. Many specialty drugs have coupons that can help you save money on your copay or coinsurance. ',
                          answerline2: '',
                        },
                        {
                          serviceLabel:
                            'How can I save money on my prescriptions?',
                          answerline1: (
                            <RichText
                              className="manage-image"
                              spans={[
                                <span key={0}>
                                  One way you could save is to use the drug
                                  price comparison tool. You can compare the
                                  prices of the drugs you’re currently taking
                                  with other drugs that may work as well,
                                  including generic drugs, which can cost much
                                  less than brand-name drugs. Go to the{' '}
                                </span>,
                                <span className="link" key={1}>
                                  <a>Check Drug Cost & Coverage page</a>
                                  <Image
                                    src={externalIcon}
                                    alt="external Icon"
                                  />{' '}
                                </span>,
                                <span key={2}>
                                  {' '}
                                  on your caremark.com account.
                                </span>,
                              ]}
                            />
                          ),

                          answerline2: (
                            <RichText
                              className="manage-image"
                              spans={[
                                <span key={0}>
                                  You can also sign up for 90-day fills of some
                                  drugs via mail, which can save you time and
                                  money compared to picking up smaller amounts
                                  every month. To start getting your
                                  prescriptions by mail, go to the{' '}
                                </span>,
                                <span className="link" key={1}>
                                  <a>Start Rx Delivery by Mail page</a>
                                  <Image
                                    src={externalIcon}
                                    alt="external Icon"
                                  />{' '}
                                </span>,
                                <span key={2}>
                                  on your caremark.com account. CVS Caremark
                                  Mail Service Pharmacy will fill your order and
                                  let you know when it will arrive.
                                </span>,
                              ]}
                            />
                          ),
                        },
                      ]}
                    />
                  </Column>
                </section>

                <section className="flex flex-row items-start app-body">
                  <Column className="flex-grow">
                    <PharmacyFAQ
                      serviceTitle="Help with Pharmacies & Mail Order"
                      className="large-section"
                      services={[
                        {
                          serviceLabel: 'Do I have to use a CVS pharmacy?',
                          answerline1:
                            'CVS Caremark helps BlueCross manage your pharmacy benefits, but you don’t have to go to a CVS retail pharmacy.',
                          answerline2: '',
                        },
                        {
                          serviceLabel:
                            'Why should I use a mail order pharmacy for any of my prescriptions?',
                          answerline1:
                            'Getting the drugs you take every day to manage your health from a mail order pharmacy can save you time and money. You won’t have to make trips to the pharmacy, and you can get 90-day fills of many drugs. That can lower your cost and make it easier to avoid running out of your medications, which can keep you healthier.',
                          answerline2: (
                            <RichText
                              className="manage-image"
                              spans={[
                                <span key={0}>
                                  To start getting your prescriptions by mail,
                                  go to the{' '}
                                </span>,
                                <span className="link" key={1}>
                                  <a>Start Rx Delivery by Mail page</a>
                                  <Image
                                    src={externalIcon}
                                    alt="external Icon"
                                  />{' '}
                                </span>,
                                <span key={2}>
                                  {' '}
                                  on your caremark.com account. CVS Caremark
                                  Mail Service Pharmacy will fill your order and
                                  let you know when it will arrive.
                                </span>,
                              ]}
                            />
                          ),
                        },
                        {
                          serviceLabel:
                            'I’ve created my caremark.com account but I can’t see prescription info for my teenage dependents. How can I do that?',
                          answerline1:
                            'To view and manage prescription information for dependents age 13-18, they’ll need to create their own caremark.com account. After doing so, they can then grant you to access to manage their mail order prescriptions and see claims history.',
                          answerline2:
                            'After creating their caremark.com account, they can grant you access by going to their Profile on caremark.com, then choosing Family Access. This change may take around 4 hours to update.',
                        },
                      ]}
                    />
                  </Column>
                </section>
              </Column>
            </Card>
          </Column>
        </section>
      </Column>
    </main>
  );
};

export default Pharmacy;
