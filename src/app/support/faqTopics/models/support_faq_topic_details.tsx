import { ContactUs } from '@/components/composite/ContactUs';
import { AppLink } from '@/components/foundation/AppLink';
import { externalIcon } from '@/components/foundation/Icons';
import { RichText } from '@/components/foundation/RichText';
import { Row } from '@/components/foundation/Row';
import Image from 'next/image';
import Link from 'next/link';
import { FaqTopicDetails, FaqTopicParam, FaqTopicType } from './faq_details';

export const SupportFaqTopicDetails: Map<
  FaqTopicParam | string | null,
  FaqTopicDetails
> = new Map([
  [
    FaqTopicParam.BenefitsAndCoverage,
    {
      faqPathParam: FaqTopicParam.BenefitsAndCoverage,
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
                  <a href="/member/support">contact us</a>{' '}
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
    FaqTopicParam.Claims,
    {
      faqPathParam: FaqTopicParam.Claims,
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
                  <a href="/member/support">contact us</a>
                </span>,
                <span key={4}>, and we’ll walk you through it.</span>,
              ]}
            />
          ),
          bulletPoints: [],
          para2: '',
        },
      ],
      faqSecondCardDetails: [
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
                  <a href="/member/support">Contact us</a>{' '}
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
                  <a href="/member/support">Contact us.</a>{' '}
                </span>,
              ]}
            />
          ),
        },
      ],
    },
  ],
  [
    FaqTopicParam.PriorAuthorization,
    {
      faqPathParam: FaqTopicParam.PriorAuthorization,
      topicType: FaqTopicType.PriorAuthorization,
      faqTopicHeaderDetails: {
        title: 'Prior Authorization FAQ',
        description: 'Learn more about prior authorizations and statuses.',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'Understanding Prior Authorization',
          serviceLabel: 'What is a prior authorization?',
          para1:
            // eslint-disable-next-line quotes
            "Prior authorization is a process that ensures any prescribed treatments or drugs are appropriate and safe. Prior authorizations require your health provider to get approval from your health insurance plan. It's also known as preauthorization or pre-certification.",
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I get a prior authorization?',
          para1:
            'If your doctor prescribes a treatment that needs prior authorization, they’ll ask us for one when they write your treatment plan. We’ll review the case, make sure the treatment is appropriate and safe, and make a decision. If it’s approved, we’ll send you a letter to let you know.',
          bulletPoints: [],
          para2: '',
        },
      ],
      faqSecondCardDetails: [
        {
          serviceTitle: 'Help with Prior Authorization Status',
          serviceLabel: 'What does the status of my prior authorizations mean?',
          para1:
            // eslint-disable-next-line quotes
            'Prior authorizations can have one of three statuses: approved, partially approved or denied. Approved means that your health plan agrees with your doctor that the medical service or prescription drug is necessary and safe. Partially approved means that your health plan has concerns about the safety or need of part of your request. Denied means that your health plan does not agree with your doctor that a medical service or prescription drug is necessary or safe.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'My prior authorization was approved. What do I do next?',
          para1:
            // eslint-disable-next-line quotes
            'If your request was approved, move forward with the medical service or drug as your doctor instructed.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What can I do if my prior authorization is partially approved or denied?',
          para1: (
            <RichText
              spans={[
                <span key={1}>
                  If a medical service or prescription drug prior authorization
                  was partially approved or denied, we’ll send you a letter
                  explaining why with details on how to file an appeal. For more
                  information, please
                </span>,
                <span key={2}>
                  <a className="link font-bold"> contact us.</a>
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
            // eslint-disable-next-line quotes
            "I'm expecting a prior authorization. Where are all my prior authorizations?",
          para1: (
            <RichText
              spans={[
                <span key={1}>
                  We’ll show your medical prior authorizations on the
                </span>,
                <span key={2}>
                  <Link
                    href="/member/myplan/priorauthorizations"
                    className="link font-bold"
                  >
                    {' '}
                    prior authorization page.
                  </Link>
                </span>,
                <span key={3}>
                  {' '}
                  For any prescription drug-related prior authorizations, you
                  may need to log in to your Caremark account. If your pharmacy
                  benefits aren’t provided by CVS Caremark, you can
                </span>,
                <span key={4}>
                  <a className="link font-bold"> contact us</a>
                </span>,
                <span key={5}>
                  , and we’ll help you find your prescription prior
                  authorization status.
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
    FaqTopicParam.IdCards,
    {
      faqPathParam: FaqTopicParam.IdCards,
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
                  <a href="/member/idcard">order a new Member ID card here</a>{' '}
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
                  <a href="/member/support">Contact us</a>
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
    FaqTopicParam.SharingPermisionsSecurity,
    {
      faqPathParam: FaqTopicParam.SharingPermisionsSecurity,
      topicType: FaqTopicType.SharingPermisionsSecurity,
      faqTopicHeaderDetails: {
        title: 'Security FAQ',
        description:
          'How to keep your information secure, manage your online account and more.',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'About Multi-factor Authentication',
          serviceLabel: 'What is multi-factor authentication (MFA)?',
          para1:
            'Multi-factor authentication (MFA) is a way to make sure your online accounts are extra safe. It means you need to prove who you are in more than one way before you can log in. Usually, you use your password and then something else, like a code sent to your phone. This makes it much harder for someone else to get into your account.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Why do I need to use MFA for my account?',
          para1:
            'BlueCross wants to keep your personal health information safe, and MFA is one way to make it harder for someone else to log in to your account.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I set up MFA on my account?',
          para1:
            'On the new Security Settings page, you’ll see four options for turning on MFA. You can choose to receive your codes from an Authenticator app, text, email, or phone call. You’ll provide some information, then provide the one-time passcode (OTP) that we sent you.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Can I choose how to get my codes?',
          para1:
            'Yes. You can choose to get your code through Authenticator apps, text, email, and phone calls. You will automatically be set up for email when you register, but you can switch methods at any time.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'If I have multiple methods turned on, which one of them gets the code?',
          para1: 'You’ll get asked at login which method you prefer most.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What do I do if I need to update my email address or phone number? ',
          para1:
            'To update your contact information, you need to turn off that method of MFA first. Then you can update your information on the Security Settings page.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What should I do if I can’t access my code?',
          para1:
            'You’ll need to contact us to have a representative remove that MFA channel so you can log in again.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What if I don’t receive the MFA code?',
          para1:
            'If you don’t receive the code, check your spam or junk folders. If you can’t find it, try changing the email address or phone number where you’re getting the code.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Can I turn off MFA?',
          para1:
            'You can turn off MFA on the Security Settings page. There is a toggle for turning MFA on and off. But we don’t recommend turning it off as it keeps your account less secure.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What is an Authenticator App and how do I use it for MFA?',
          para1:
            'An Authenticator app is an application that you download onto your mobile device that allows you to receive security codes from BCBST and other websites. Authenticators are one of the most secure ways to use MFA with your online account. Some people use Microsoft or Google Authenticator, for examples, as their Authenticator app.',
          bulletPoints: [],
          para2: '',
        },
      ],
      faqSecondCardDetails: [
        {
          serviceTitle: 'About Email Verification',
          serviceLabel: 'What is a one-time passcode and how does it work?',
          para1:
            'A one-time passcode is a security code sent to a user to verify their identity as the owner of their online account. This could be part of the registration process, a forgotten password, enabling multifactor authentication or logging in with MFA.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I confirm my email using a one-time passcode?',
          para1:
            'After you’ve registered, you’ll be told that you need to verify your email address. You’ll get an email with a one-time passcode that you’ll need to enter.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'I didn’t receive my one-time passcode email. What should I do?',
          para1:
            'Double check the email address or phone number to which the code is being sent. Make sure to check the spam or junk folders on your computer or phone. There will be a resend security code button in case your one-time passcode expires before you’re able to complete the process. If you’re still having trouble, contact us using the phone number on the back of your Member ID card.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Can I use a different email address for verification?',
          para1:
            'The email address you use for your online account registration will be the address associated with your online account. At any point, you can change your email address in the communications settings or security settings pages in your online account or mobile app and this will change the email address used for verification.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What should I do if my one-time passcode expires?',
          para1:
            'You should be able to resend yourself a new code on the page that is asking you for the security code. If you’re not able to resend one, then you may need to start the process over to receive a new one.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Is email verification required for all users?',
          para1:
            'Email verification is required for all users creating online accounts.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I update my email address for verification?',
          para1:
            'If you entered the wrong email address during registration, you’ll need to use the number on the back of your Member ID card to call us and have us change it for you.',
          bulletPoints: [],
          para2: '',
        },
      ],
      faqThirdCardDetails: [
        {
          serviceTitle: 'About Account Management',
          serviceLabel: 'How do I reset my password using a one-time passcode?',
          para1:
            'When trying to reset your password the screens will ask you to provide your username and date of birth to verify your identity. Then an email with a one-time security code will be sent to the email address on file for your account. Provide that code with your new password. ',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What should I do if my one-time passcode for password reset expires?',
          para1:
            'You’ll need to resend a new code to yourself. If you don’t receive the new code, then you will need to start the password reset process over from the beginning to receive a new code.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'Is there a limit to how many times I can reset my password using one-time passcodes?',
          para1: 'You can get 10 one-time passcodes a day.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What should I do if I still can’t access my account after resetting my password?',
          para1:
            'Make sure the username you’re trying to use is correct. Also verify that the new password you are entering matches the new password you just created for that online account. If you’re still having trouble you may need to call us using the number on the back of your Member ID card.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'How do I update my personal information on my account?',
          para1:
            'You can update your email address and phone number in your online account or the mobile app. To update other personal information, like your mailing address, you’ll need to contact us using the number on the back of your Member ID card.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What should I do if I forget my username?',
          para1:
            'If you forget your username, you can use the Forgot Username / Username Retrieval links from any login screen to recover it.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'Can I link multiple accounts under one login? ',
          para1:
            'A user with multiple plans or multiple roles (Member, Personal Representative or Authorized User) will have access to all their plans and roles automatically in their online account. If you don’t see all that displayed correctly, you can contact us to verify that all policies and roles are associated with your online account. ',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'What should I do if I suspect unauthorized access to my account?',
          para1:
            'If you suspect someone has been accessing your online account, you should contact us at the number on the back of your Member ID card and tell the representative that you want to file a report with the Privacy Office.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How can I switch between my different policies? ',
          para1:
            'You’ll be given the chance to consolidate all your online accounts and plans under a single username so that they can access all their plans online with the same credentials. Use the plan Switcher at the top of the page to choose the plan which you want to view. ',
          bulletPoints: [],
          para2: '',
        },
      ],
    },
  ],
  [
    FaqTopicParam.MyPlanInformation,
    {
      faqPathParam: FaqTopicParam.MyPlanInformation,
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
                url="/member/myhealth/primarycare"
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
  [
    FaqTopicParam.Pharmacy,
    {
      faqPathParam: FaqTopicParam.Pharmacy,
      topicType: FaqTopicType.Pharmacy,
      faqTopicHeaderDetails: {
        title: 'Pharmacy FAQ',
        description:
          'How to find pharmacies, find prescription drug coverage and more',
      },
      faqTopCardDetails: [
        {
          serviceTitle: 'Help with Prescription Drugs',
          serviceLabel: 'How can I find out which drugs my plan covers?',
          para1: (
            <p className="body-1">
              To see a list of all the prescription drugs your plan covers, go
              to the{' '}
              <AppLink
                className="p-0"
                callback={openBankDocument}
                label="Check Drug Cost & Coverage page"
                displayStyle="inline"
                icon={
                  <Image
                    src={externalIcon}
                    className="icon inline"
                    alt="Info"
                  />
                }
              />{' '}
              on your caremark.com account.
            </p>
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              You can also{' '}
              <AppLink
                className="p-0"
                callback={openBankDocument}
                label="view or download a pdf formulary. "
                displayStyle="inline"
              />
            </p>
          ),
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I get a prior authorization?',
          para1:
            'If your doctor prescribes a drug that needs a prior authorization, they’ll ask us for one when they write your prescription. We’ll review the case, make sure the drug is appropriate and safe, and make a decision. If it’s approved, we’ll send you a letter to let you know. Then you’ll be able to get your drugs from the pharmacy.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'What is a specialty medication?',
          para1:
            'Specialty medications are expensive drugs that usually treat complex conditions. Some specialty drugs can be delivered to your home, but some of them have to be taken at the doctor’s office.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How do I know if a drug is a specialty drug?',
          para1:
            'Specialty drugs are typically on higher tiers like 4 or 5 and usually need prior authorizations. They can also have special handing requirements, like temperature control, too. Some specialty drugs are only available at certain pharmacies. Many specialty drugs have coupons that can help you save money on your copay or coinsurance.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel: 'How can I save money on my prescriptions?',
          para1: (
            <p className="body-1">
              One way you could save is to use the drug price comparison tool.
              You can compare the prices of the drugs you’re currently taking
              with other drugs that may work as well, including generic drugs,
              which can cost much less than brand-name drugs. Go to the{' '}
              <AppLink
                className="p-0"
                callback={openBankDocument}
                label="Check Drug Cost & Coverage page"
                displayStyle="inline"
                icon={
                  <Image
                    src={externalIcon}
                    className="icon inline"
                    alt="Info"
                  />
                }
              />{' '}
              on your caremark.com account.
            </p>
          ),
          bulletPoints: [],
          para2: (
            <p className="body-1">
              You can also sign up for 90-day fills of some drugs via mail,
              which can save you time and money compared to picking up smaller
              amounts every month. To start getting your prescriptions by mail,
              go to the{' '}
              <AppLink
                className="p-0"
                callback={openBankDocument}
                label="Start Rx Delivery by Mail page "
                displayStyle="inline"
                icon={
                  <Image
                    src={externalIcon}
                    className="icon inline"
                    alt="Info"
                  />
                }
              />{' '}
              on your caremark.com account. CVS Caremark Mail Service Pharmacy
              will fill your order and let you know when it will arrive.
            </p>
          ),
        },
      ],
      faqSecondCardDetails: [
        {
          serviceTitle: 'Help with Pharmacies & Mail Order',
          serviceLabel: 'Do I have to use a CVS pharmacy?',
          para1:
            'CVS Caremark helps BlueCross manage your pharmacy benefits, but you don’t have to go to a CVS retail pharmacy.',
          bulletPoints: [],
          para2: '',
        },
        {
          serviceTitle: '',
          serviceLabel:
            'Why should I use a mail order pharmacy for any of my prescriptions?',
          para1:
            'Getting the drugs you take every day to manage your health from a mail order pharmacy can save you time and money. You won’t have to make trips to the pharmacy, and you can get 90-day fills of many drugs. That can lower your cost and make it easier to avoid running out of your medications, which can keep you healthier.',
          bulletPoints: [],
          para2: (
            <p className="body-1">
              To start getting your prescriptions by mail, go to the{' '}
              <AppLink
                className="p-0"
                callback={openBankDocument}
                label="Start Rx Delivery by Mail page"
                displayStyle="inline"
                icon={
                  <Image
                    src={externalIcon}
                    className="icon inline"
                    alt="Info"
                  />
                }
              />{' '}
              on your caremark.com account. CVS Caremark Mail Service Pharmacy
              will fill your order and let you know when it will arrive.
            </p>
          ),
        },
        {
          serviceTitle: '',
          serviceLabel:
            'I’ve created my caremark.com account but I can’t see prescription info for my teenage dependents. How can I do that?',
          para1:
            'To view and manage prescription information for dependents age 13-18, they’ll need to create their own caremark.com account. After doing so, they can then grant you to access to manage their mail order prescriptions and see claims history.',
          bulletPoints: [],
          para2:
            'After creating their caremark.com account, they can grant you access by going to their Profile on caremark.com, then choosing Family Access. This change may take around 4 hours to update.',
        },
      ],
    },
  ],
]);
function openBankDocument() {
  window?.open(process.env.NEXT_PUBLIC_PORTAL_BANK_DRAFT_FORM);
}
