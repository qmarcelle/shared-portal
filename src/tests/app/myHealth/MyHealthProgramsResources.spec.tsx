import MyHealthProgramsResources from '@/app/myHealth/healthProgramsResources';
import { VisibilityRules } from '@/visibilityEngine/rules';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

let vRules: VisibilityRules = {};

function activeAndNotFSAOnlyProfiler(rules: VisibilityRules) {
  return (
    !rules?.futureEffective &&
    !rules?.fsaOnly &&
    !rules?.terminated &&
    !rules?.katieBeckNoBenefitsElig
  );
}

function activeAndHealthPlanMemberProfiler(rules: VisibilityRules) {
  return !rules?.wellnessOnly && activeAndNotFSAOnlyProfiler(rules);
}

const renderUI = (vRules: VisibilityRules) => {
  return render(<MyHealthProgramsResources visibilityRules={vRules} />);
};

describe('MyHealthProgramsResources', () => {
  beforeEach(() => {
    vRules = {};
  });
  it('should render UI correctly for MyHealthProgramsResources', () => {
    const component = renderUI(vRules);
    screen.getByRole('heading', {
      name: 'Health Programs & Resources',
    });
    screen.getByText(
      'Your plan includes programs, guides and discounts to help make taking charge of your health easier and more affordable.',
    );
    screen.getByText('View all your plan benefits here');
    expect(component).toMatchSnapshot();
  });

  it('should render UI correctly for Able To Health Program', () => {
    vRules.mentalHealthSupport = true;
    vRules.medical = true;
    activeAndNotFSAOnlyProfiler(vRules);
    const component = renderUI(vRules);
    screen.getByText('Mental Health');
    screen.getByText('AbleTo');
    screen.getByText(
      'AbleTo’s personalized and focused 8-week programs help you with sleep, stress, anxiety and more. Get the help you need.',
    );
    screen.getByText('Learn More About AbleTo');
    screen.getByText('Generally good for:');
    screen.getByText('Anxiety');
    screen.getByText('Depression');
    screen.getByText('Grief');
    screen.getByText('Stress');
    expect(component).toMatchSnapshot();
  });

  it('should render UI correctly for Talk To Nurse Health Program', () => {
    vRules.healthCoachElig = true;
    activeAndNotFSAOnlyProfiler(vRules);
    const component = renderUI(vRules);
    screen.getByText('Urgent Care');
    screen.getByText('Talk to a Nurse');
    screen.getByText(
      'Connect with a nurse anytime 24/7 at no cost to you. They can answer questions and help you make decisions about your care.',
    );
    screen.getByText('Learn More About Nurseline');
    screen.getByText('Generally good for:');
    screen.getByText('Assessing symptoms and advice');
    screen.getByText('General health information');
    screen.getByText('Education and support on conditions or procedures');
    screen.getByText('Help making decisions for surgery or other treatments');
    expect(component).toMatchSnapshot();
  });

  it('should render UI correctly for Teladoc Health Primar Card Provider Health Program', () => {
    vRules.primary360Eligible = true;
    activeAndHealthPlanMemberProfiler(vRules);
    const component = renderUI(vRules);
    screen.getByText('Primary Care');
    screen.getByText('Teladoc Health Primary Card Provider');
    screen.getByText(
      'With Primary 360, you can talk to a board-certified primary acre doctor by video or phone seven days a week.',
    );
    screen.getByText('Learn More About Teladoc Health Primary Care');
    screen.getByText('Generally good for:');
    screen.getByText('Annual checkups and preventive care');
    screen.getByText('Prescriptions');
    screen.getByText('Lab orders and recommended screenings');
    screen.getByText('Referrals to in-network specialists');
    expect(component).toMatchSnapshot();
  });

  it('should render UI correctly for Teladoc Mental  Health Program', () => {
    vRules.myStrengthCompleteEligible = true;
    activeAndHealthPlanMemberProfiler(vRules);
    const component = renderUI(vRules);
    screen.getByText('Mental Health');
    screen.getByText('Teladoc Mental Health');
    screen.getByText(
      'Speak with a therapist, psychologist or psychiatrist seven days a week from anywhere.',
    );
    screen.getByText('Learn More About Teladoc Mental Health');
    screen.getByText('Generally good for:');
    screen.getByText('Anxiety, stress, feeling overwhelmed');
    screen.getByText('Relationship conflicts');
    screen.getByText('Depression');
    screen.getByText('Trauma and PTSD');
    expect(component).toMatchSnapshot();
  });

  it('should render UI correctly for Hinge Health Program', () => {
    vRules.hingeHealthEligible = true;
    const component = renderUI(vRules);
    screen.getByText('Physical Therapy');
    screen.getByText('Hinge Health Back & Joint Care');
    screen.getByText(
      'You and your eligible family members can get help for back and joint issues with personalized therapy from the comfort of your home.',
    );
    screen.getByText('Learn More About Hinge Health');
    screen.getByText('Generally good for:');
    screen.getByText('Back pain');
    screen.getByText('Wrist and ankle pain');
    screen.getByText('Pelvic pain and incontinence');
    screen.getByText('Neck and shoulder pain');
    expect(component).toMatchSnapshot();
  });
  it('should render UI correctly for CareTN One On One Health Support', () => {
    vRules.isCondensedExperience = false;
    vRules.cmEnable = true;
    vRules.commercial = true;
    const component = renderUI(vRules);
    screen.getByText('Advice & Support');
    screen.getByText('CareTN One-on-One Health Support');
    screen.getByText(
      'Did you know you can talk to your very own care team? The care management program lets you message a BlueCross nurse or other health professional for support and answers — at no cost to you.',
    );
    screen.getByText('Learn More About CareTN');
    screen.getByText('Generally good for:');
    screen.getByText('Living with long-term health conditions');
    screen.getByText('Diabetes');
    screen.getByText('Respiratory health');
    screen.getByText('Mental health');
    expect(component).toMatchSnapshot();
  });
  it('should render UI correctly for Teladoc Health Diabetes MANAGEMENT Program when rule is true', () => {
    vRules.diabetesManagementEligible = true;
    activeAndHealthPlanMemberProfiler(vRules);

    const component = renderUI(vRules);
    screen.getByText('Diabetes');
    screen.getByText('Teladoc Health Diabetes Management Program');
    screen.getByText(
      'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
    );
    screen.getByText('Learn More About Diabetes Management');
    screen.getByText('Generally good for:');
    screen.getByText('Living with diabetes');
    screen.getByText('Receiving diabetes supplies');
    screen.getByText('Monitoring glucose');
    screen.getByText('Building healthy habits');
    expect(component).toMatchSnapshot();
  });
  it('should not render Teladoc Health Diabetes MANAGEMENT Program Card when rule is false', () => {
    vRules.diabetesManagementEligible = false;
    const component = renderUI(vRules);

    expect(
      screen.queryByText('Teladoc Health Diabetes Management Program'),
    ).toBeNull();
    expect(
      screen.queryByText(
        'Personalized coaching, unlimited strips, a smart meter, tips and action plans at no extra cost.',
      ),
    ).toBeNull();

    expect(component.container).toMatchSnapshot();
  });
  it('should render UI correctly for Teladoc Health Diabetes PREVENTION Program when rule is true', () => {
    vRules.diabetesPreventionEligible = true;
    activeAndHealthPlanMemberProfiler(vRules);

    const component = renderUI(vRules);
    screen.getByText('Diabetes');
    screen.getByText('Teladoc Health Diabetes Prevention Program');
    screen.getByText(
      'Get a personal action plan, health coaching and a smart scale at no extra cost.',
    );
    screen.getByText('Learn More About Diabetes Prevention');
    screen.getByText('Generally good for:');
    screen.getByText('Viewing weight trends');
    screen.getByText('Expert coaching and advice');
    screen.getByText('Sharing reports with the doctor');
    screen.getByText('Personalized eating tips');
    expect(component).toMatchSnapshot();
  });

  it('should render UI correctly for Teladoc Blood Pressure Management Program Card', () => {
    vRules.hypertensionMgmt = true;
    const component = renderUI(vRules);

    screen.getByText('Blood Pressure');
    screen.getByText('Teladoc Health Blood Pressure Management Program');

    expect(component.container).toMatchSnapshot();
  });

  it('should not render Teladoc Blood Pressure Management Program Card when rule is false', () => {
    vRules.hypertensionMgmt = false;
    const component = renderUI(vRules);

    expect(screen.queryByText('Blood Pressure')).toBeNull();
    expect(
      screen.queryByText('Teladoc Health Blood Pressure Management Program'),
    ).toBeNull();

    expect(component.container).toMatchSnapshot();
  });

  it('should render UI correctly for TeladocSecondOpinionAdviceAndSupport', () => {
    vRules.consumerMedicalEligible = true;
    const component = renderUI(vRules);
    screen.getByText('Advice & Support');
    screen.getByText('Teladoc Second Opinion Advice & Support');
    screen.getByText(
      'Use Teladoc Health to get a second opinion on any diagnosis, treatment or surgery at no extra cost.',
    );
    screen.getByText('Learn More About Second Opinion Advice & Support');
    screen.getByText('Generally good for:');
    screen.getByText('Confirming a diagnosis');
    screen.getByText('Deciding on a treatment plan');
    screen.getByText('Getting expert guidance on a surgery');
    screen.getByText(
      'Providing answers to your questions about your diagnosis or recommended treatment',
    );
    expect(component).toMatchSnapshot();
  });
  it('should render the Silver and Fitness card if the pzn rule is true', () => {
    vRules.medicare = true;
    vRules.individual = true;
    vRules.isSilverFitClient = true;

    const component = renderUI(vRules);
    screen.getByText('Silver&Fit Fitness Program');
    screen.getByText(
      'Get healthy with gym memberships, a personalized Get Started Program and a library of digital workout videos.',
    );
    expect(component).toMatchSnapshot();
  });

  it('should not render the Silver and Fitness card if the pzn rule is true', () => {
    vRules.medicare = false;
    vRules.individual = true;
    vRules.isSilverFitClient = false;
    const component = renderUI(vRules);
    expect(screen.queryByText('Silver&Fit Fitness Program')).toBeNull();

    expect(component).toMatchSnapshot();
  });

  it('should render the Quest Select Lab if the pzn rule is true', () => {
    vRules.questSelectEligible = true;
    vRules.active = true;

    const component = renderUI(vRules);
    expect(
      screen.getByText('QuestSelect Low-Cost Lab Testing'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
      ),
    ).toBeInTheDocument();
    expect(component).toMatchSnapshot();
  });

  it('should not render the Quest Select Lab card if the pzn rule is false', () => {
    const component = renderUI(vRules);
    expect(screen.queryByText('QuestSelect Low-Cost Lab Testing')).toBeNull();
    expect(
      screen.queryByText(
        'As an independent lab, QuestSelect can make sure you get the lowest price when you need lab testing — even if you have your sample drawn at another provider.',
      ),
    ).toBeNull;

    expect(component).toMatchSnapshot();
  });

  it('should render the teladoc general and urgent card if pzn rule is true', () => {
    vRules.teladocEligible = true;
    const component = renderUI(vRules);
    expect(screen.getByText('Teladoc Health General & Urgent Care'));
    expect(
      screen.getByText(
        'Access to board-certified physicians 24/7 for the diagnosis and treatment of non-emergency conditions.',
      ),
    );

    expect(component).toMatchSnapshot();
  });

  it('should not render the teladoc general and urgent card if pzn rule is false', () => {
    const component = renderUI(vRules);
    expect(
      screen.queryByText('Teladoc Health General & Urgent Care'),
    ).toBeNull();

    expect(component).toMatchSnapshot();
  });

  it('should render the Healthy Maternity card if pzn rule is true', () => {
    vRules.fullyInsuredHealthyMaternity = true;
    vRules.medical = true;
    const component = renderUI(vRules);
    expect(screen.getByText('Healthy Maternity'));
    expect(
      screen.getByText(
        'This program offers personalized pre- and post-natal care, confidential maternity health advice and around-the-clock support to keep you and your baby healthy.',
      ),
    );

    expect(component).toMatchSnapshot();
  });

  it('should not render the Healthy Maternity card if pzn rule is false', () => {
    const component = renderUI(vRules);
    expect(screen.queryByText('Healthy Maternity')).toBeNull();

    expect(component).toMatchSnapshot();
  });
});
