import {
  alightIcon,
  hingeHealthLogo,
  questSelectLogo,
  silverFitLogo,
  teladocHealthLogo,
} from '@/components/foundation/Icons';
import { HealthProgramDetails } from './health_program_details';
import { HealthProgramType } from './health_program_type';

export const healthProgramsandResourcesDetails: Map<
  HealthProgramType,
  HealthProgramDetails
> = new Map([
  [
    HealthProgramType.Alight,
    {
      healthProgramType: HealthProgramType.Alight,
      healthProgramHeaderDetails: {
        title: 'Alight Second Opinion Advice & Support',
        description:
          'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Alight',
        icon: alightIcon,
        redirectLink: process.env.NEXT_PUBLIC_ALIGHT ?? '',
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan at no cost to you',
        'Earn a $400 gift card if your doctor has suggested certain surgeries',
        'Call, chat or email available',
      ],
      costForThisOptionDetails: {
        description: 'You can expect to pay:',
        cost: '$0',
      },
      goodForOptionDetails: [
        'Speaking with an expert about your diagnosis',
        'Rare or life-threatening condition support',
        'Considering risky or complicated treatment',
        'Compare costs of treatment or tests',
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
        redirectLink: process.env.NEXT_PUBLIC_SILVER_FIT ?? '',
      },
      whyUseThisOptionDetails: [
        'In-network & covered by your plan at no extra cost',
        'Discounted fitness memberships',
      ],
      costForThisOptionDetails: {
        description: 'You can expect to pay:',
        cost: '$0',
      },
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
        redirectLink: '',
      },
      whyUseThisOptionDetails: [
        'If eligible, covered by your plan at no extra cost',
        'Personalized tips, action plans and 1-on-1 coaching',
        'Free smart blood pressure monitor',
        'Tips on nutrition, activity and more',
      ],
      costForThisOptionDetails: {
        description:
          'If you have been diagnosed with high blood pressure, you can expect to pay: ',
        cost: '$0',
      },
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
        redirectLink: process.env.NEXT_PUBLIC_HINGE_HEALTH ?? '',
      },
      whyUseThisOptionDetails: [
        'In-network & no cost to you',
        'Self-guided or coaching options available',
        'Downloadable app available',
        'Support in pain management',
      ],
      costForThisOptionDetails: {
        description: 'Depending on the type of visit, you can expect to pay:',
        cost: '$15 or less',
      },
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
        redirectLink: '',
      },
      whyUseThisOptionDetails: [
        'If eligible, covered by your plan at no extra cost',
        'Personalized tips, action plans and coaching',
        'Free smart meter and unlimited strips and lancets',
      ],
      costForThisOptionDetails: {
        description:
          'If you have been diagnosed with type 1 or type 2 diabetes, you can expect to pay:',
        cost: '$0',
      },
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
        redirectLink: process.env.NEXT_PUBLIC_QUEST_SELECT ?? '',
      },
      whyUseThisOptionDetails: [
        'In-network with your plan*',
        'Pay lowest price in network for labs',
        'No need to change your doctor — just show your QuestSelect card',
        'Get access to your lab results online',
      ],
      programType: 'QuestSelect',
      costForThisOptionDetails: {
        description: 'Your lab benefits will apply when using QuestSelect.',
        cost: '',
      },
      goodForOptionDetails: [
        'Blood samples',
        'Urine samples',
        'Throat cultures',
        'And more',
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
        redirectLink: process.env.NEXT_PUBLIC_QUEST_SELECT ?? '',
      },
      whyUseThisOptionDetails: [
        'If eligible, covered by your plan at no extra cost',
        'Dedicated expert coaching support',
        'Programs for healthy habits',
        'Free smart scale',
      ],
      programType: 'TeladocHealthDiabetesPrevention',
      costForThisOptionDetails: {
        description: 'If eligible, you can expect to pay:',
        cost: '$0',
      },
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
]);
