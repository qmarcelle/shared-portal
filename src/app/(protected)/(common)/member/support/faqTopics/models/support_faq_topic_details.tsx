import { ContactUs } from '@/components/composite/ContactUs';
import { AppLink } from '@/components/foundation/AppLink';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import Link from 'next/link';
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
            'What does "premium/copay/deductible/coinsurance" mean?',
          para1: (
            <RichText
              spans={[
                <span key={0}>
                  Here's a quick definition for the most common terms you'll see
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
                  The percentage of costs for care that you&apos;ll pay — usually
                  after you&apos;ve paid your deductible.
                  <br />
                </span>,
                <span key={9}>
                  For more health insurance terms and definitions, go to the{' '}
                </span>,
                <span key={10}>
                  <Row>
                    <Link href="https://www.healthcare.gov/glossary" className="link font-bold" target="_blank" rel="noopener noreferrer">glossary on healthcare.gov</Link>
                    <Image src={externalIcon} className="icon" alt="Info" />.
                  </Row>
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              
            </p>
          ),
        },
        {
          serviceTitle: '',
          serviceLabel: 'What are networks, and which one am I signed up for?',
          para1: (
            <p className="body-1">
              A network is a group of doctors we work with to provide care to our members. Providers in our network agree to offer our members a discount. Providers who aren&apos;t in our network don&apos;t offer that discount, so their rates are higher.
            </p>
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              To find your network, look at the front of your Member ID card. It&apos;s most likely on the bottom left corner.
            </p>
          ),
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
                  <Link href="/findcare">Find Care tool</Link>{' '}
                </span>,
                <span key={2}>
                  . Either search the provider&apos;s name and check which networks
                  they&apos;re in, or search for providers near you and filter your
                  results by your network. If you are logged in, your search
                  results will automatically list providers in your network.
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              
            </p>
          ),
        },
        {
          serviceTitle: '',
          serviceLabel:
            "What happens when I see a provider who's not in my network?",
          para1: (
            <p className="body-1">
              That depends on your plan benefits. For most plans, if you see a provider who is not in your network, you will likely be paying toward your out-of-network deductible and coinsurance. In that case, we typically pay the amount that we&apos;d pay a provider who is in your network, according to your out-of-network deductible and coinsurance. You&apos;ll pay whatever is left on your bill.
            </p>
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              Please keep in mind that some plans, like those on Healthcare.gov or through TennCare, don&apos;t pay for providers who aren&apos;t in your network at all.
            </p>
          ),
        },
        {
          serviceTitle: '',
          serviceLabel: 'What if I need care when I\'m traveling?',
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
                  networks while you&apos;re traveling. If you see a small suitcase
                  icon on your Member ID card, then you have Global Core. If
                  you&apos;re planning a trip and have specific questions, the best
                  thing to do is call Global Core directly at 1-800-810-2583.
                  They&apos;re ready to help you.
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
                  <Link href="/findcare">Find Care tool</Link>
                  <br />
                </span>,
                <span key={8} className="font-bold">
                  . Medicare{' '}
                </span>,
                <span key={9}>members should </span>,
                <span className="link font-bold" key={10}>
                  <Link href="/support">contact us</Link>{' '}
                </span>,
                <span key={11}>
                  , and we&apos;ll help you decide how to get care.
                  <br />
                </span>,
                <span key={12} className="font-bold">
                  Medicaid or Medicare with Medicaid{' '}
                </span>,
                <span key={13}>
                  members can only get coverage for providers out of the state
                  of Tennessee if it&apos;s a{' '}
                </span>,
                <span key={14}>
                  <Link href="/emergency-care" className="link font-bold">true emergency</Link>.
                </span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              
            </p>
          ),
        },
      ],
    },
  ],
  // ... rest of the array entries remain unchanged ...
]);
function openBankDocument() {
  window?.open(process.env.NEXT_PUBLIC_PORTAL_BANK_DRAFT_FORM);
}
