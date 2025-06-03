import { VirtualHealthCareDetails } from '@/app/mentalHealthOptions/models/mental_health_care_options_details';
import { HealthProgramType } from '../myHealthPrograms/models/health_program_type';
import { HealthProgramsResourcesName } from './health_programs_resources_names';
const urlRedirect = '/member/myhealth/healthprograms/';
export const myHealthProgramsandResourcesDetails: Map<
  HealthProgramsResourcesName,
  VirtualHealthCareDetails
> = new Map([
  [
    HealthProgramsResourcesName.TeladocSecondOpinionAdviceAndSupport,
    {
      healthcareType: 'Advice & Support',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Second Opinion Advice & Support',
      description:
        // eslint-disable-next-line quotes
        'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
      link: 'Learn More About Second Opinion Advice & Support',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Confirming a diagnosis',
        'Deciding on a treatment plan',
        'Getting expert guidance on a surgery',
        'Providing answers to your questions about your diagnosis or recommended treatment',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocSecondOption}`,
    },
  ],
  [
    HealthProgramsResourcesName.CareTNOneOnOneHealthSupport,
    {
      healthcareType: 'Advice & Support',
      icon: 'CareTN',
      healthCareName: 'CareTN One-on-One Health Support',
      description:
        // eslint-disable-next-line quotes
        'Did you know you can talk to your very own care team? The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
      link: 'Learn More About CareTN',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Living with long-term health conditions',
        'Diabetes',
        'Respiratory health',
        'Mental health',
      ],
      url: `${urlRedirect}caremanagement`,
    },
  ],
  [
    HealthProgramsResourcesName.TeladocHealthBloodPressureManagementProgram,
    {
      healthcareType: 'Blood Pressure',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Health Blood Pressure Management Program',
      description:
        // eslint-disable-next-line quotes
        'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
      link: 'Learn More About Blood Pressure Management',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'High blood pressure management',
        'Meal planning',
        'Building healthy habits',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocBP}`,
    },
  ],
  [
    HealthProgramsResourcesName.TeladocHealthDiabetesManagementProgram,
    {
      healthcareType: 'Diabetes',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Health Diabetes Management Program',
      description:
        // eslint-disable-next-line quotes
        'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
      link: 'Learn More About Diabetes Management',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Living with diabetes',
        'Receiving diabetes supplies',
        'Monitoring glucose',
        'Building healthy habits',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocHealthDiabetesManagement}`,
    },
  ],
  [
    HealthProgramsResourcesName.TeladocHealthDiabetesPreventionProgram,
    {
      healthcareType: 'Diabetes',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Health Diabetes Prevention Program',
      description:
        // eslint-disable-next-line quotes
        'Get a personal action plan, health coaching and a smart scale at no extra cost.',
      link: 'Learn More About Diabetes Prevention',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Viewing weight trends',
        'Expert coaching and advice',
        'Sharing reports with the doctor',
        'Personalized eating tips',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocHealthDiabetesPrevention}`,
    },
  ],
  [
    HealthProgramsResourcesName.SilverAndFitFitnessProgram,
    {
      healthcareType: 'Fitness',
      icon: 'SilverFit',
      healthCareName: 'Silver&Fit Fitness Program ',
      description:
        // eslint-disable-next-line quotes
        'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
      link: 'Learn More About Silver&Fit',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Weight loss',
        'Getting fit',
        'At-home fitness',
        'Gym memberships',
      ],
      url: `${urlRedirect + HealthProgramType.SilverFit}`,
    },
  ],
  [
    HealthProgramsResourcesName.QuestSelectLowCostLabTesting,
    {
      healthcareType: 'Lab Testing',
      icon: 'QuestSelect',
      healthCareName: 'QuestSelect Low-Cost Lab Testing',
      description:
        // eslint-disable-next-line quotes
        'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
      link: 'Learn More About QuestSelect',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Blood samples',
        'Urine samples',
        'Throat cultures',
        'And more',
      ],
      url: `${urlRedirect + HealthProgramType.QuestSelect}`,
    },
  ],
  [
    HealthProgramsResourcesName.AbleTo,
    {
      healthcareType: 'Mental Health',
      icon: 'AbleToIcon',
      healthCareName: 'AbleTo',
      description:
        'AbleTo’s personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.',
      link: 'Learn More About AbleTo',
      itemDataTitle: 'Generally good for:',
      itemData: ['Anxiety', 'Depression', 'Grief', 'Stress'],
      url: `${urlRedirect + HealthProgramType.AbleTo}`,
    },
  ],
  [
    HealthProgramsResourcesName.TeladocMentalHealth,
    {
      healthcareType: 'Mental Health',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Mental Health',
      description:
        // eslint-disable-next-line quotes
        'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere.',
      link: 'Learn More About Teladoc Mental Health',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Anxiety, stress, feeling overwhelmed',
        'Relationship conflicts',
        'Depression',
        'Trauma and PTSD',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocMentalHealth}`,
    },
  ],
  [
    HealthProgramsResourcesName.HingeHealthBackAndJointCare,
    {
      healthcareType: 'Physical Therapy',
      icon: 'HingeHealth',
      healthCareName: 'Hinge Health Back & Joint Care',
      description:
        // eslint-disable-next-line quotes
        'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
      link: 'Learn More About Hinge Health',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Back pain',
        'Wrist and ankle pain',
        'Pelvic pain and incontinence',
        'Neck and shoulder pain',
      ],
      url: `${urlRedirect + HealthProgramType.HingeHealth}`,
    },
  ],
  [
    HealthProgramsResourcesName.HealthyMaternity,
    {
      healthcareType: 'Pregnancy',
      icon: 'HealthyMaternity',
      healthCareName: 'Healthy Maternity',
      description:
        // eslint-disable-next-line quotes
        'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
      link: 'Learn More About Healthy Maternity',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Maternity Support',
        'Advice from a registered nurse',
        'Pregnancy health advice',
        'Immunization needs and schedules',
      ],
      url: `${urlRedirect + HealthProgramType.HealthyMaternity.toLowerCase()}`,
    },
  ],
  [
    HealthProgramsResourcesName.TeladocHealthPrimaryCardProvider,
    {
      healthcareType: 'Primary Care',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Health Primary Card Provider',
      description:
        'With Primary 360, you can talk to a board-certified primary acre doctor by video or phone seven days a week.',
      link: 'Learn More About Teladoc Health Primary Care',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Annual checkups and preventive care',
        'Prescriptions',
        'Lab orders and recommended screenings',
        'Referrals to in-network specialists',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocPrimaryCareProvider}`,
    },
  ],
  [
    HealthProgramsResourcesName.TeladocHealthGeneralAndUrgentCare,
    {
      healthcareType: 'Urgent Care',
      icon: 'TelaDoc',
      healthCareName: 'Teladoc Health General & Urgent Care',
      description:
        // eslint-disable-next-line quotes
        'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
      link: 'Learn More About Teladoc Health Urgent Care',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Allergies, cold, fever or flu',
        'Skin condition (rashes or insect bites)',
        'Urinary tract infections',
        'Constipation or diarrhea',
      ],
      url: `${urlRedirect + HealthProgramType.TeladocHealthGeneralUrgentCare}`,
    },
  ],
  [
    HealthProgramsResourcesName.TalkToNurse,
    {
      healthcareType: 'Urgent Care',
      healthCareName: 'Talk to a Nurse',
      description:
        // eslint-disable-next-line quotes
        'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care.',
      link: 'Learn More About Nurseline',
      itemDataTitle: 'Generally good for:',
      itemData: [
        'Assessing symptoms and advice',
        'General health information',
        'Education and support on conditions or procedures',
        'Help making decisions for surgery or other treatments ',
      ],
      url: `${urlRedirect + HealthProgramType.TalkToNurse}`,
    },
  ],
]);
