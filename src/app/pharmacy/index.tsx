'use client';

import { RecentClaimSection } from '@/components/composite/RecentClaimSection';
import { WelcomeBanner } from '@/components/composite/WelcomeBanner';
import { Card } from '@/components/foundation/Card';
import { Column } from '@/components/foundation/Column';
import {
  costIcon,
  cvsCaremarkIcon,
  downloadIcon,
  externalIcon,
  mailOrderPharmacyIcon,
  prescriptionIcon,
  rightIcon,
  searchPharmacyIcon,
  shoppingCreditIcon,
} from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Spacer } from '@/components/foundation/Spacer';
import { TextBox } from '@/components/foundation/TextBox';
import { Title } from '@/components/foundation/Title';
import {
  isBlueCareEligible,
  isFreedomMaBlueAdvantage,
  isMedicarePrescriptionPaymentPlanEligible,
  isPharmacyBenefitsEligible,
} from '@/visibilityEngine/computeVisibilityRules';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CVSCaremarkInformationCard } from './components/CVSCaremarkInformation';
import PharmacyBenefits from './components/PharmacyBenefits';
import { PharmacyDocuments } from './components/PharmacyDocuments';
import { PharmacyFAQ } from './components/PharmacyFAQ';
import { PharmacySpendingSummary } from './components/PharmacySpendingSummary';
import { PrescriptionPaymentsOptions } from './components/PrescriptionPaymentOptions';
import { ShopOverCounterItemsCard } from './components/ShopOverCounterItems';
import { PharmacyData } from './models/app/pharmacyData';

export type PharmacyProps = {
  data: PharmacyData;
};

const Pharmacy = ({ data }: PharmacyProps) => {
  const router = useRouter();
  //To Do Remove Below EsLint once integrated with API
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const redirectToPharmacyClaims = (claimId: string) => {
    router.push('/pharmacy/pharmacyClaims');
  };

  const getOtcContent = () => (
    <ShopOverCounterItemsCard
      icon={shoppingCreditIcon}
      title="Shop Over-the-Counter Items"
      description="You get a quarterly allowance for over-the-counter (OTC) items. You can spend it on things like cold medicine, vitamins and more. And once you set up an account, you can even shop for those items online. Set up or log in to your online account to get OTC items shipped right to your door."
      url={process.env.NEXT_PUBLIC_SHOP_OVER_THE_COUNTER ?? ''}
    />
  );
  const isBlueCare = isBlueCareEligible(data.visibilityRules);
  const isFreedomMaBlueAdvantageMember = !!isFreedomMaBlueAdvantage(
    data.visibilityRules,
  );
  return (
    <main className="flex flex-col justify-center items-center page">
      <WelcomeBanner name="Pharmacy" />
      {(isBlueCare || isFreedomMaBlueAdvantageMember) && (
        <Column className="app-content app-base-font-color">
          <section className="flex flex-row items-start app-body ">
            <Column>
              <PharmacyBenefits
                isFreedomMember={isFreedomMaBlueAdvantageMember}
              />
            </Column>
          </section>
          {isFreedomMaBlueAdvantageMember && (
            <section className="flex flex-row items-start app-body ">
              <Column> {getOtcContent()}</Column>
            </section>
          )}
        </Column>
      )}

      {!isBlueCare && !isFreedomMaBlueAdvantageMember && (
        <Column className="app-content app-base-font-color">
          {isPharmacyBenefitsEligible(data.visibilityRules) && (
            <section className="flex flex-row items-start app-body ">
              <Column className="flex-grow">
                <CVSCaremarkInformationCard
                  title="Get More with CVS Caremark"
                  description="A caremark.com account will let you get prescriptions by mail, price a medication and more."
                  icon={<Image src={cvsCaremarkIcon} alt="download form" />}
                  linkText="Visit CVS Caremark"
                  linkIcon={<Image src={externalIcon} alt="download form" />}
                  services={[
                    {
                      serviceIcon: (
                        <Image src={prescriptionIcon} alt="Prescription Icon" />
                      ),
                      serviceLabel: 'View or Refill My Prescriptions',
                    },
                    {
                      serviceIcon: (
                        <Image
                          src={mailOrderPharmacyIcon}
                          alt="Mail Order Pharmacy Icon"
                        />
                      ),
                      serviceLabel: 'Get My Prescriptions by Mail',
                      url:
                        '/sso/launch?PartnerSpId=' +
                        process.env.NEXT_PUBLIC_IDP_CVS_CAREMARK,
                    },
                    {
                      serviceIcon: <Image src={costIcon} alt="Cost Icon" />,
                      serviceLabel: 'Find Drug Cost & My Coverage',
                    },
                    {
                      serviceIcon: (
                        <Image
                          src={searchPharmacyIcon}
                          alt="Search Pharmacy Icon"
                        />
                      ),
                      serviceLabel: 'Find a Pharmacy',
                    },
                  ]}
                />
              </Column>
            </section>
          )}
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
                    memberId: '23',
                    claimStatusCode: 2,
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
                    memberId: '2',
                    claimStatusCode: 3,
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
                    memberId: '23',
                    claimStatusCode: 1,
                  },
                ]}
              />
            </Column>
            <Column className=" flex-grow page-section-36_67 items-stretch">
              <PharmacySpendingSummary
                className="large-section md:w-[352px] md:h-[248px]"
                title="My Pharmacy Spending Summary"
                description="View your annual statement for your pharmacy claims."
                linkLabel="View Pharmacy Spending Summary"
                url="/spendingSummary?type=Pharmacy"
              />
            </Column>
          </section>
          <section className="flex flex-row items-start app-body">
            <Column className="flex-grow">
              <Title
                className="title-1 ml-4 md:mt-12"
                text="Resources & Support"
              />
              {getOtcContent()}{' '}
            </Column>
          </section>
          <section className="flex flex-row items-start app-body">
            {isPharmacyBenefitsEligible(data.visibilityRules) && (
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
                          linkURL: `/assets/formularies/${data.formularyURL}/Drug-Formulary-List.pdf`,
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
                            // eslint-disable-next-line quotes
                            "We call it the G0-510 form. You'll use it only for prescription drug claims when the claim is not filled through your pharmacist.",
                          linkURL:
                            'http://www.bcbst.com/docs/pharmacy/go-510.pdf',
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
                          linkURL: '/assets/cvs-mail-order-form.pdf',
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
            )}
            <Column className=" flex-grow page-section-63_33 items-stretch">
              {isPharmacyBenefitsEligible(data.visibilityRules) && (
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
                                      To see a list of all the prescription
                                      drugs your plan covers, go to the{' '}
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
                              serviceLabel:
                                'How do I get a prior authorization?',
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
                                      prices of the drugs you’re currently
                                      taking with other drugs that may work as
                                      well, including generic drugs, which can
                                      cost much less than brand-name drugs. Go
                                      to the{' '}
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
                                      You can also sign up for 90-day fills of
                                      some drugs via mail, which can save you
                                      time and money compared to picking up
                                      smaller amounts every month. To start
                                      getting your prescriptions by mail, go to
                                      the{' '}
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
                                      Mail Service Pharmacy will fill your order
                                      and let you know when it will arrive.
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
                                      To start getting your prescriptions by
                                      mail, go to the{' '}
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
                                      Mail Service Pharmacy will fill your order
                                      and let you know when it will arrive.
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
              )}
              {isMedicarePrescriptionPaymentPlanEligible(
                data.visibilityRules,
              ) && (
                <Card className="large-section flex flex-row items-start app-body ">
                  <Column>
                    <TextBox
                      type="title-2"
                      text="Prescription Payment Options"
                    />
                    <Spacer size={32} />
                    <section className="flex flex-row items-start app-body">
                      <Column className="flex-grow">
                        <PrescriptionPaymentsOptions
                          isMedicare={true}
                          isBlueCarePlus={false}
                        />
                      </Column>
                    </section>
                  </Column>
                </Card>
              )}
            </Column>
          </section>
        </Column>
      )}
    </main>
  );
};

export default Pharmacy;
