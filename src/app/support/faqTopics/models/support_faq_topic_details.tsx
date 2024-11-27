import { ContactUs } from '@/components/composite/ContactUs';
import { AppLink } from '@/components/foundation/AppLink';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import { FaqTopicDetails, FaqTopicType } from './faq_details';

export const SupportFaqTopicDetails: Map<
  FaqTopicType | string | null,
  FaqTopicDetails
> = new Map([
  [
    FaqTopicType.BenefitsAndCoverage,
    {
      topicType: FaqTopicType.BenefitsAndCoverage,
      faqTopicHeaderDetails: {
        title: 'Benefits & Coverage FAQ',
        description: 'Learn more about finding care, coverage and more.',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'Understanding Coverage',
          serviceLabel:
            'What does “premium/copay/deductible/coinsurance” mean?',
          para1: (
            <RichText
              spans={[
                <span key={0}>
                  Here’s a quick definition for the most common terms you’ll see
                  in insurance:
                  <br />
                </span>,
                <span key={1} className="font-bold mb-2">
                  Premium:{' '}
                </span>,
                <span key={2}>
                  The monthly payment for your insurance policy.
                  <br />
                </span>,
                <span key={3} className="font-bold">
                  Copayment (Copay):{' '}
                </span>,
                <span key={4}>
                  A fixed dollar amount you must pay with your own money for
                  medical services, like office visits or prescription drugs.
                  <br />
                </span>,
                <span key={5} className="font-bold">
                  Deductible:{' '}
                </span>,
                <span key={6}>
                  The amount you pay each year before your health plan begins
                  paying.
                  <br />
                </span>,
                <span key={7} className="font-bold">
                  Coinsurance:{' '}
                </span>,
                <span key={8}>
                  The percentage of costs for care that you’ll pay — usually
                  after you’ve paid your deductible.
                  <br />
                </span>,

                <span key={9}>
                  For more health insurance terms and definitions, go to the{' '}
                </span>,
                <span key={10}>
                  <Row>
                    <a className="link font-bold">glossary on healthcare.gov</a>
                    <Image src={externalIcon} className="icon" alt="Info" />.
                  </Row>
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What are networks, and which one am I signed up for?',
          para1:
            'A network is a group of doctors we work with to provide care to our members. Providers in our network agree to offer our members a discount. Providers who aren’t in our network don’t offer that discount, so their rates are higher.',
          bulletPoints: [],
          para2:
            'To find your network, look at the front of your Member ID card. It’s most likely on the bottom left corner.',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'How do I find out if my provider is in network or find one who is?',
          para1: (
            <RichText
              spans={[
                <span key={0}>
                  You can search for providers by network in the{' '}
                </span>,
                <span className="link font-bold" key={1}>
                  <a>Find Care tool</a>{' '}
                </span>,
                <span key={2}>
                  . Either search the provider’s name and check which networks
                  they’re in, or search for providers near you and filter your
                  results by your network. If you are logged in, your search
                  results will automatically list providers in your network.
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What happens when I see a provider who’s not in my network?',
          para1:
            'That depends on your plan benefits. For most plans, if you see a provider who is not in your network, you will likely be paying toward your out-of-network deductible and coinsurance. In that case, we typically pay the amount that we’d pay a provider who is in your network, according to your out-of-network deductible and coinsurance. You’ll pay whatever is left on your bill. ',
          bulletPoints: [],
          para2:
            'Please keep in mind that some plans, like those on Healthcare.gov or through TennCare, don’t pay for providers who aren’t in your network at all.',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What if I need care when I’m traveling?',

          para1: (
            <RichText
              spans={[
                <span key={0}>
                  This depends on what kind of plan you have.
                  <br /> <br />
                </span>,
                <span key={1}>Many </span>,
                <span key={2} className="font-bold">
                  employer plans{' '}
                </span>,
                <span key={3}>
                  include the Blue Cross Blue Shield Global Core® travel
                  program that lets you see providers in other BlueCross
                  networks while you’re traveling. If you see a small suitcase
                  icon on your Member ID card, then you have Global Core. If
                  you’re planning a trip and have specific questions, the best
                  thing to do is call Global Core directly at 1-800-810-2583.
                  They’re ready to help you.
                  <br />
                </span>,
                <span key={4}>If you have an </span>,
                <span key={5} className="font-bold">
                  individual or family plan,{' '}
                </span>,
                <span key={6}>
                  or one through your employer, you can enter your location into
                  the{' '}
                </span>,
                <span className="link font-bold" key={7}>
                  <a>Find Care tool</a>
                  <br />
                </span>,
                <span key={8} className="font-bold">
                  . Medicare{' '}
                </span>,

                <span key={9}>members should </span>,
                <span className="link font-bold" key={10}>
                  <a href="/support">contact us</a>{' '}
                </span>,
                <span key={11}>
                  , and we’ll help you decide how to get care.
                  <br />
                </span>,
                <span key={12} className="font-bold">
                  Medicaid or Medicare with Medicaid{' '}
                </span>,

                <span key={13}>
                  members can only get coverage for providers out of the state
                  of Tennessee if it’s a{' '}
                </span>,
                <span key={14}>
                  <a className="link font-bold">true emergency</a>.
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
      ],
    },
  ],
  [
    FaqTopicType.Claims,
    {
      topicType: FaqTopicType.Claims,
      faqTopicHeaderDetails: {
        title: 'Claims FAQ',
        description: 'Learn more about claims or how to file a dispute.',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'Understanding Claims',
          serviceLabel: 'What is a claim?',
          para1:
            'When you get care from a doctor or other health care provider, they send us a bill called a claim. Your claim summary helps you see what the provider billed, what we paid, and what your share of the cost is.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Need help reading your claim summary?',
          para1: (
            <RichText
              spans={[
                <span key={0}>You can watch </span>,
                <span className="link font-bold" key={1}>
                  <a>this quick video</a>{' '}
                </span>,
                <span key={2}>
                  that will introduce you to the Claim Summary. You can also{' '}
                </span>,
                <span className="link font-bold" key={3}>
                  <a href="/support">contact us</a>
                </span>,
                <span key={4}>, and we’ll walk you through it.</span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
      ],
      faqBottomCardDetails: [
        {
          serviceTitle: 'Disputing Claims',
          serviceLabel: 'Do you think we made a mistake?',
          para1:
            'We do everything we can to make sure we’ve paid your claim the right way, based on your benefits. If you don’t agree with the decision we made, you have a right to tell us why and ask us to reconsider. This is called an appeal (sometimes we call it a grievance). Everyone has the right to an appeal, but the type of plan you have makes a difference in how those rights work.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I file an appeal?',
          para1: (
            <RichText
              spans={[
                <span className="link font-bold" key={0}>
                  <a href="/support">Contact us</a>{' '}
                </span>,
                <span key={1}>
                  and we’ll walk you through the process and paperwork needed.
                  Here are some important things to keep in mind:{' '}
                </span>,
              ]}
            />
          ),
          bulletPoints: [
            <RichText
              key={0}
              spans={[
                <span key={0}>
                  You must ask for an appeal within 180 days of getting a claim
                  denial (unless your Evidence of Coverage says you have more
                  time.)
                </span>,
              ]}
            />,
            <RichText
              key={1}
              spans={[
                <span key={0}>
                  We’ll give you an answer within 15 to 60 days of getting your
                  appeal — depending on your health plan rules.
                </span>,
              ]}
            />,
            <RichText
              key={2}
              spans={[
                <span key={0}>
                  If waiting will stop you from getting urgent care you need,
                  tell us and we’ll give you an answer within 72 hours.
                </span>,
              ]}
            />,
            <RichText
              key={3}
              spans={[
                <span key={0}>
                  You can file an appeal yourself, and we’re here to help if you
                  have questions. But if you think you need extra support, you
                  can choose to work with a representative — like a lawyer — to
                  help you file your appeal or file a civil lawsuit.
                </span>,
              ]}
            />,
            <RichText
              key={4}
              spans={[
                <span key={0}>
                  You may begin an external appeal with an outside agency at the
                  same time we’re reviewing your appeal if you need care
                  urgently or you are getting ongoing care.
                </span>,
              ]}
            />,
          ],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Do you need extra help?',
          para1: (
            <RichText
              spans={[
                <span key={0}>
                  If you think you need extra help from an outside agency, there
                  are Consumer Assistance Programs available to help you. They
                  can tell you about your rights and assist you in filing a
                  grievance.
                  <br />
                  <br />
                </span>,
                <span key={1}>
                  You’ll need to contact the agency that works with your type of
                  plan:
                </span>,
              ]}
            />
          ),

          bulletPoints: [
            <RichText
              key={0}
              spans={[
                <span key={0}>
                  Non-Federal Government Fully Insured and Self-Funded Plans:
                  U.S. Department of Health and Human Services Health Insurance
                  Assistance Team (HIAT) —{' '}
                </span>,
                <span key={1} className="font-bold">
                  1-800-393-2789
                  <br />
                </span>,
              ]}
            />,
            <RichText
              key={1}
              spans={[
                <span key={0}>
                  State of Tennessee Insurance Program (State of Tennessee
                  employee plan, higher education, local education and local
                  government plans): State Division of Benefits Administration —{' '}
                </span>,
                <span key={1} className="font-bold">
                  1-866-579-0029
                  <br />
                </span>,
              ]}
            />,
            <RichText
              key={2}
              spans={[
                <span key={0}>
                  All other Self-Funded plans: U.S. Department of Labor’s
                  Employee Benefits Security Administration (EBSA) —{' '}
                </span>,
                <span key={1} className="font-bold">
                  1-866-444-3272{' '}
                </span>,
                <span key={2}>or </span>,
                <span key={3} className="link font-bold">
                  www.askebsa.dol.gov
                  <br />
                </span>,
              ]}
            />,
            <RichText
              key={3}
              spans={[
                <span key={0}>
                  All other Fully Insured plans: Tennessee Department of
                  Commerce and Insurance (TDCI) —{' '}
                </span>,
                <span key={1} className="font-bold">
                  1-800-432-4029{' '}
                </span>,
                <span key={2}>or </span>,
                <span key={3} className="link font-bold">
                  <Row>
                    visit online{' '}
                    <Image
                      className="-mt-[5px]"
                      src={externalIcon}
                      alt="external"
                    />
                  </Row>
                </span>,
              ]}
            />,
          ],
          para2: (
            <RichText
              spans={[
                <span key={0}>Not sure what type of plan you have? </span>,
                <span className="link font-bold" key={1}>
                  <a href="/support">Contact us.</a>{' '}
                </span>,
              ]}
            />
          ),
        },
      ],
    },
  ],
  [
    FaqTopicType.IdCards,
    {
      topicType: FaqTopicType.IdCards,
      faqTopicHeaderDetails: {
        title: 'ID Cards FAQ',
        description:
          'Do you have questions about your ID cards? We’re here to help.',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'Help with Member ID Cards',
          serviceLabel: 'How do I get a new Member ID card?',
          para1: (
            <RichText
              spans={[
                <span key={0}>You can </span>,
                <span className="link font-bold" key={1}>
                  <a href="/memberIDCard">order a new Member ID card here</a>{' '}
                </span>,
                <span key={2}>
                  or by calling or chatting with us.
                  <br />
                </span>,
                <span key={3}>
                  You can also download a digital version or print your own copy
                  of your card from that same page, or you can see it in the{' '}
                </span>,

                <span key={4}>
                  <Row>
                    <span className="link font-bold"> BCBSTN℠ mobile app </span>
                    <Image
                      className="-mt-[5px]"
                      src={externalIcon}
                      alt="external"
                    />
                    .
                  </Row>
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I change incorrect info on my Member ID card?',
          para1: (
            <RichText
              spans={[
                <span className="link font-bold" key={0}>
                  <a href="/support">Contact us</a>
                </span>,
                <span key={1}>
                  , and we’ll walk you through getting your card updated.
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
      ],
    },
  ],
  [
    FaqTopicType.MyPlanInformation,
    {
      topicType: FaqTopicType.MyPlanInformation,
      faqTopicHeaderDetails: {
        title: 'My Plan Information FAQ',
        description: 'How to update your address, dependents, and more.',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'Updating Plan Information',
          serviceLabel:
            'How do I update personal info like my address, last name or payment information?',
          para1: (
            <p className="body-1">
              <ContactUs label="Contact us" />, and we’ll get your account
              updated.
            </p>
          ),
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I add or remove a dependent?',
          para1: (
            <p className="body-1">
              <ContactUs label="Contact us" />, and we’ll get your account
              updated.
            </p>
          ),
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'How do I pay my premium or change my payment information?',
          para1: (
            <p className="body-1">
              This depends on your plan. For most plans, you can do a bank
              draft, check by phone, or mail in payment.{' '}
              <ContactUs label="Contact us" />, and we’ll talk you through it or
              you can{' '}
              <AppLink
                className="p-0"
                callback={openBankDocument}
                label="download the bank draft form."
                displayStyle="inline"
              />
            </p>
          ),
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'I’m a Medicaid or Medicare with Medicaid member. How do I switch my primary care provider? ',
          para1: (
            <p className="body-1">
              If you want to see a different doctor than the one you were
              assigned, you can <ContactUs label=" contact us" /> for help, or
              you can
              <AppLink
                className="p-0"
                url="/updateMyPrimaryCareProvider"
                label="update your primary care provider here."
                displayStyle="inline"
              />
            </p>
          ),
          bulletPoints: [],
          para2: '',
        },
      ],
    },
  ],
]);
function openBankDocument() {
  window?.open(process.env.NEXT_PUBLIC_PORTAL_BANK_DRAFT_FORM);
}
