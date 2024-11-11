export interface MemberBenefitsBean {
  memberCk: number;
  medicalBenefits?: BenefitDetailsBean;
  dentalBenefits?: BenefitDetailsBean;
  visionBenefits?: BenefitDetailsBean;
  otherBenefits?: BenefitDetailsBean;
}
