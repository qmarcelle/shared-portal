import {
  alightIcon,
  hingeHealthLogo,
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
]);
