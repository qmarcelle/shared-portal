'use server';

import { VisibilityRules } from '@/visibilityEngine/rules';
import { HealthProgramType } from '../../myHealth/healthProgramsResources/myHealthPrograms/models/health_program_type';

const urlRedirect = '/myhealth/healthprograms/';

export interface VirtualCareOption {
  id: string;
  title: string;
  description: string;
  url: string;
  isVisible: boolean;
}

export async function getVirtualCareOptions(
  visibilityRules: VisibilityRules,
): Promise<VirtualCareOption[]> {
  // Evaluate DPP eligibility on the server
  const isDPPEligible = !!(
    visibilityRules &&
    visibilityRules.diabetesPreventionEligible &&
    visibilityRules.teladocEligible &&
    !visibilityRules.fsaOnly &&
    !visibilityRules.terminated &&
    !visibilityRules.wellnessOnly &&
    visibilityRules.groupRenewalDateBeforeTodaysDate
  );

  const allOptions: VirtualCareOption[] = [
    {
      id: '1',
      title: 'CareTN One-on-One Health Support',
      description:
        'The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
      url: `${urlRedirect}caremanagement`,
      isVisible: true,
    },
    {
      id: '2',
      title: 'Healthy Maternity',
      description:
        'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
      url: `${urlRedirect + HealthProgramType.HealthyMaternity}`,
      isVisible: true,
    },
    {
      id: '3',
      title: 'Teladoc Health Blood Pressure Management Program',
      description:
        'Get a free smart blood pressure monitor, expert tips and action plans and health coaching at no extra cost.',
      url: `${urlRedirect + HealthProgramType.TeladocBP}`,
      isVisible: true,
    },
    {
      id: '4',
      title: 'Teladoc Health Diabetes Management Program',
      description:
        'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
      url: `${urlRedirect + HealthProgramType.TeladocHealthDiabetesManagement}`,
      isVisible: true,
    },
    {
      id: '5',
      title: 'Virtual Diabetes Prevention Program (DPP)',
      description:
        'Get a personal action plan, health coaching and a smart scale at no extra cost.',
      url: `${urlRedirect + HealthProgramType.TeladocHealthDiabetesPrevention}`,
      isVisible: isDPPEligible,
    },
    {
      id: '6',
      title: 'Teladoc Second Opinion Advice & Support',
      description:
        'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
      url: `${urlRedirect + HealthProgramType.TeladocSecondOption}`,
      isVisible: true,
    },
    {
      id: '7',
      title: 'QuestSelect™ Low-Cost Lab Testing',
      description:
        'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
      url: `${urlRedirect + HealthProgramType.QuestSelect}`,
      isVisible: true,
    },
    {
      id: '8',
      title: 'Silver&Fit Fitness Program',
      description:
        'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
      url: `${urlRedirect + HealthProgramType.SilverFit}`,
      isVisible: true,
    },
  ];

  return allOptions;
}
