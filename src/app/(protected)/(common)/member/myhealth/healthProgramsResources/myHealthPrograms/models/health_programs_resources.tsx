import {
  ableToLogo,
  hingeHealthLogo,
  questSelectLogo,
  silverFitLogo,
  teladocHealthLogo,
} from '@/components/foundation/Icons';
import { getHingeHealthLink } from '@/visibilityEngine/computeVisibilityRules';
import { HealthProgramDetails } from './health_program_details';
import { HealthProgramType } from './health_program_type';

export const healthProgramsandResourcesDetails: Map<
  HealthProgramType,
  HealthProgramDetails
> = new Map([
  [
    HealthProgramType.TeladocSecondOption,
    {
      healthProgramType: HealthProgramType.TeladocSecondOption,
      healthProgramHeaderDetails: {
        title: 'Teladoc Second Opinion Advice & Support',
        description:
          'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan at no cost',
        'Feel confident in the steps ahead with a clear diagnosis and/or treatment plan that’s right for you',
        'Start your case by phone, online or on the Teladoc Health app',
      ],
      costForThisOptionDetails: [
        {
          description: 'You can expect to pay:',
          cost: '$0',
        },
      ],
      goodForOptionDetails: [
        'Confirming a diagnosis',
        'Deciding on a treatment plan',
        'Getting expert guidance on a surgery',
        'Providing answers to your questions about your diagnosis or recommended treatment',
      ],
    },
  ],
  [
    HealthProgramType.SilverFit,
    {
      healthProgramType: HealthProgramType.SilverFit,
      healthProgramHeaderDetails: {
        title: 'Silver&Fit Fitness Program',
        description:
          'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
        serviceDesc: '',
        buttonText: 'Use Silver&Fit',
        icon: silverFitLogo,
        redirectLink: () => {
          return process.env.NEXT_PUBLIC_SILVER_FIT ?? '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan at no extra cost',
        'Discounted fitness memberships',
      ],
      costForThisOptionDetails: [
        {
          description: 'You can expect to pay:',
          cost: '$0',
        },
      ],
      goodForOptionDetails: [
        'Weight loss',
        'Getting fit',
        'At-home fitness',
        'Gym memberships',
        'Fitness tracking',
      ],
    },
  ],
  [
    HealthProgramType.TeladocBP,
    {
      healthProgramType: HealthProgramType.TeladocBP,
      healthProgramHeaderDetails: {
        title: 'Teladoc Health Blood Pressure Management Program',
        description:
          'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return '';
        },
      },
      whyUseThisOptionDetails: [
        'If eligible, covered by your plan at no extra cost',
        'Personalized tips, action plans and 1-on-1 coaching',
        'Free smart blood pressure monitor',
        'Tips on nutrition, activity and more',
      ],
      costForThisOptionDetails: [
        {
          description:
            'If you have been diagnosed with high blood pressure, you can expect to pay: ',
          cost: '$0',
        },
      ],
      goodForOptionDetails: [
        'High blood pressure management',
        'Meal planning',
        'Building healthy habits',
      ],
    },
  ],
  [
    HealthProgramType.HingeHealth,
    {
      healthProgramType: HealthProgramType.HingeHealth,
      healthProgramHeaderDetails: {
        title: 'Hinge Health Back & Joint Care',
        description:
          'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Hinge Health',
        icon: hingeHealthLogo,
        redirectLink: getHingeHealthLink,
      },
      whyUseThisOptionDetails: [
        'In-network & no cost to you',
        'Self-guided or coaching options available',
        'Downloadable app available',
        'Support in pain management',
      ],
      costForThisOptionDetails: [
        {
          description: 'Depending on the type of visit, you can expect to pay:',
          cost: '$15 or less',
        },
      ],
      goodForOptionDetails: [
        'Back pain',
        'Wrist and ankle pain',
        'Pelvic pain and incontinence',
        'Neck and shoulder pain',
        'Pelvic strengthening',
        'Thighs and knee pain',
        'Shin and calve pain ',
        'Feet pain',
      ],
    },
  ],
  [
    HealthProgramType.TeladocHealthDiabetesManagement,
    {
      healthProgramType: HealthProgramType.TeladocHealthDiabetesManagement,
      healthProgramHeaderDetails: {
        title: 'Teladoc Health Diabetes Management Program',
        description:
          'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost to you.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return '';
        },
      },
      whyUseThisOptionDetails: [
        'If eligible, covered by your plan at no extra cost',
        'Personalized tips, action plans and coaching',
        'Free smart meter and unlimited strips and lancets',
      ],
      costForThisOptionDetails: [
        {
          description:
            'If you have been diagnosed with type 1 or type 2 diabetes, you can expect to pay:',
          cost: '$0',
        },
      ],
      goodForOptionDetails: [
        'Living with diabetes',
        'Receiving diabetes supplies',
        'Monitoring glucose',
        'Building healthy habits ',
      ],
    },
  ],
  [
    HealthProgramType.QuestSelect,
    {
      healthProgramType: HealthProgramType.QuestSelect,
      healthProgramHeaderDetails: {
        title: 'QuestSelect Low-Cost Lab Testing',
        description:
          'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Get Your QuestSelect Card',
        icon: questSelectLogo,
        redirectLink: () => {
          return process.env.NEXT_PUBLIC_QUEST_SELECT ?? '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network with your plan*',
        'Pay lowest price in network for labs',
        'No need to change your doctor — just show your QuestSelect card',
        'Get access to your lab results online',
      ],
      programType: 'QuestSelect',
      costForThisOptionDetails: [
        {
          description: 'Your lab benefits will apply when using QuestSelect.',
          cost: '',
        },
      ],
      goodForOptionDetails: [
        'Blood samples',
        'Urine samples',
        'Throat cultures',
        'And more',
      ],
    },
  ],
  [
    HealthProgramType.TeladocPrimaryCareProvider,
    {
      healthProgramType: HealthProgramType.TeladocPrimaryCareProvider,
      healthProgramHeaderDetails: {
        title: 'Teladoc Health Primary Care Provider',
        description:
          'With Primary 360, you can talk to a board-certified primary care doctor by video or phone, seven days a week.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan',
        'See a PCP as early as the next day',
        'Downloadable app, call or video chat available',
      ],
      costForThisOptionDetails: [
        {
          description: 'Depending on the type of visit, you can expect to pay:',
          cost: '$99 or less',
        },
      ],
      goodForOptionDetails: [
        'Annual checkups and preventive care',
        'Prescriptions',
        'Lab orders and recommended screenings',
        'Referrals to in-network specialists',
        'Support with long-term conditions like diabetes, hypertension and mental health',
      ],
    },
  ],
  [
    HealthProgramType.TalkToNurse,
    {
      healthProgramType: HealthProgramType.TalkToNurse,
      healthProgramHeaderDetails: {
        title: 'Talk to a Nurse',
        description:
          'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care.',
        serviceDesc: '',
        serviceDesc2: [
          <span key={0}>
            Please note, nurses cannot prescribe medications. You can call
            anytime at
          </span>,
          <span className="font-bold" key={1}>
            {' '}
            1-800-818-8581,
          </span>,
          <span key={2}> TTY</span>,
          <span key={3} className="font-bold">
            {' '}
            1-800-308-7231.
          </span>,
        ],
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan with no cost to you',
        'Connect anytime 24/7',
      ],
      costForThisOptionDetails: [
        {
          description: 'You can expect to pay:',
          cost: '$0',
        },
      ],
      goodForOptionDetails: [
        'Assessing symptoms and advice',
        'General health information',
        'Education and support on conditions or procedures',
        'Help making decisions for surgery or other treatments',
      ],
    },
  ],
  [
    HealthProgramType.TeladocHealthGeneralUrgentCare,
    {
      healthProgramType: HealthProgramType.TeladocHealthGeneralUrgentCare,
      healthProgramHeaderDetails: {
        title: 'Teladoc Health General & Urgent Care',
        description:
          'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan',
        'Available anytime 24/7',
        'Less expensive than urgent care or the ER',
        'Downloadable app, call or video chat available',
      ],
      costForThisOptionDetails: [
        {
          description: 'Depending on the type of visit, you can expect to pay:',
          cost: '$55 or less',
        },
      ],
      goodForOptionDetails: [
        'Allergies, cold, fever or flu',
        'Skin condition (rashes or insect bites)',
        'Urinary tract infections',
        'Constipation or diarrhea',
        'Arthritis',
        'Earaches',
        'Nausea or vomiting',
        'Pink eye',
        'Sunburn',
        'Sore throat',
        'Backache',
        'Food poisoning',
        'Nasal congestion',
      ],
    },
  ],
  [
    HealthProgramType.TeladocHealthDiabetesPrevention,
    {
      healthProgramType: HealthProgramType.TeladocHealthDiabetesPrevention,
      healthProgramHeaderDetails: {
        title: 'Teladoc Health Diabetes Prevention Program',
        description:
          'Get a personal action plan, health coaching and a smart scale at no extra cost.',
        serviceDesc:
          // eslint-disable-next-line quotes
          "The first time using this service, you'll need to create an account.",
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return process.env.NEXT_PUBLIC_QUEST_SELECT ?? '';
        },
      },
      whyUseThisOptionDetails: [
        'If eligible, covered by your plan at no extra cost',
        'Dedicated expert coaching support',
        'Programs for healthy habits',
        'Free smart scale',
      ],
      programType: 'TeladocHealthDiabetesPrevention',
      costForThisOptionDetails: [
        {
          description: 'If eligible, you can expect to pay:',
          cost: '$0',
        },
      ],
      goodForOptionDetails: [
        'Viewing weight trends',
        'Expert coaching and advice',
        'Sharing reports with the doctor ',
        'Personalized eating tips',
        'Setting goals and tracking progress',
        'Logging food',
      ],
    },
  ],
  [
    HealthProgramType.TeladocMentalHealth,
    {
      healthProgramType: HealthProgramType.TeladocMentalHealth,
      healthProgramHeaderDetails: {
        title: 'Teladoc Mental Health',
        description:
          'Speak with a therapist, psychologist or psychiatrist* seven days a week from anywhere.',
        serviceDesc:
          // eslint-disable-next-line quotes
          "The first time using this service, you'll need to create an account.",
        buttonText: 'Use Teladoc Health',
        icon: teladocHealthLogo,
        redirectLink: () => {
          return process.env.NEXT_PUBLIC_QUEST_SELECT ?? '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan',
        'Self-guided or live therapy options available',
        'Downloadable app, call or video chat available ',
      ],
      programType: 'TeladocMentalHealth',
      costForThisOptionDetails: [
        {
          description: 'Initial visit with a psychiatrist:',
          cost: '$220 or less',
        },
        {
          description: 'Subsequent visits with a psychiatrist:',
          cost: '$100 or less',
        },
        {
          description: 'Talk therapy with a therapist:',
          cost: '$90 or less',
        },
      ],
      goodForOptionDetails: [
        'Anxiety, stress, feeling overwhelmed',
        'Relationship conflicts',
        'Depression',
        'Trauma and PTSD',
        'Not feeling like yourself',
        'Mood swings',
        'Not wanting to get out of bed',
        'Medication management (Psychiatry only)',
      ],
    },
  ],
  [
    HealthProgramType.AbleTo,
    {
      healthProgramType: HealthProgramType.AbleTo,
      healthProgramHeaderDetails: {
        title: 'AbleTo',
        description:
          'AbleTo’s personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use AbleTo',
        icon: ableToLogo,
        redirectLink: () => {
          return process.env.NEXT_PUBLIC_ABLETO ?? '';
        },
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan',
        'Self-guided or coaching options available',
        'Work with a therapist or coach',
      ],
      costForThisOptionDetails: [
        {
          description: 'Depending on your plan, you can expect to pay:',
          cost: '$15 – $300',
        },
      ],
      goodForOptionDetails: [
        'Anxiety',
        'Depression',
        'Grief',
        'Stress',
        'Loneliness',
        'Social anxiety',
        'Self-care improvement',
        'Anxiety related to chronic pain',
        'Building healthier habits',
      ],
    },
  ],
]);
