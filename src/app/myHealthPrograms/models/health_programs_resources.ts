import { HealthProgramDetails } from './health_program_details';
import { HealthProgramType } from './health_program_type';
import { alightIcon } from '@/components/foundation/Icons';

export const healthProgramsandResourcesDetails: Map<
  HealthProgramType,
  HealthProgramDetails
> = new Map([
  [
    HealthProgramType.alight,
    {
      healthProgramType: HealthProgramType.alight,
      healthProgramHeaderDetails: {
        title: 'Alight Second Opinion Advice & Support',
        description:
          'Use My Medical Ally to get a second medical opinion on a diagnosis or recommended surgery at no extra cost.',
        serviceDesc:
          'The first time using this service, you’ll need to create an account.',
        buttonText: 'Use Alight',
        icon: alightIcon,
        redirectLink: 'https://mymedicalally.alight.com/s/login/',
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
]);
