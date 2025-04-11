import { z } from 'zod';

// Meta schema
export const metaSchema = z.object({
  applicationId: z.string().optional(),
  groupNumber: z.string().optional(),
  subscriberId: z.string().optional(),
  status: z.enum(['In Progress', 'Submitted', 'Deleted']).default('In Progress'),
  lastSaved: z.string().default(() => new Date().toISOString()),
  submittedDate: z.string().optional(),
});

// Selections schema
export const selectionsSchema = z.object({
  changePersonalInfo: z.boolean().default(false),
  addDependents: z.boolean().default(false),
  removeDependents: z.boolean().default(false),
  changeBenefits: z.boolean().default(false),
  terminatePolicy: z.boolean().default(false),
}).refine(data => {
  // Termination policy is mutually exclusive with other changes
  if (data.terminatePolicy) {
    return !data.addDependents && !data.removeDependents && !data.changeBenefits;
  }
  return true;
}, {
  message: "Policy termination cannot be combined with other changes",
  path: ["terminatePolicy"]
});

// Personal Info schema
export const personalInfoSchema = z.object({
  changeName: z.boolean().default(false),
  lastName: z.string().optional(),
  firstName: z.string().optional(),
  middleInitial: z.string().max(1).optional(),
  reasonForChange: z.string().optional(),
  changeAddress: z.boolean().default(false),
  residenceAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
    county: z.string().optional(),
  }).optional(),
  mailingAddress: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zip: z.string().optional(),
  }).optional(),
  changePhone: z.boolean().default(false),
  phone: z.string().optional(),
  changeEmail: z.boolean().default(false),
  email: z.string().email().optional(),
  changeTobaccoUse: z.boolean().default(false),
  primaryApplicantTobaccoUse: z.boolean().optional(),
  spouseTobaccoUse: z.boolean().optional(),
}).refine(data => {
  // Validate required fields when corresponding toggles are on
  if (data.changeName) {
    return !!data.lastName && !!data.firstName;
  }
  return true;
}, {
  message: "First and last name are required when changing name",
  path: ["lastName", "firstName"]
}).refine(data => {
  // Validate address fields when changing address
  if (data.changeAddress && data.residenceAddress) {
    return !!data.residenceAddress.street && 
           !!data.residenceAddress.city && 
           !!data.residenceAddress.state && 
           !!data.residenceAddress.zip;
  }
  return true;
}, {
  message: "All residence address fields are required",
  path: ["residenceAddress"]
}).refine(data => {
  // Validate phone when changing phone
  if (data.changePhone) {
    return !!data.phone;
  }
  return true;
}, {
  message: "Phone number is required when changing phone",
  path: ["phone"]
}).refine(data => {
  // Validate email when changing email
  if (data.changeEmail) {
    return !!data.email;
  }
  return true;
}, {
  message: "Email is required when changing email",
  path: ["email"]
});

// Dependent schema
export const dependentSchema = z.object({
  id: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  firstName: z.string().min(1, "First name is required"),
  middleInitial: z.string().max(1).optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  ssn: z.string().optional(),
  gender: z.enum(["Male", "Female"]),
  tobaccoUse: z.boolean(),
  relationship: z.enum(["Spouse", "Natural Child/Stepchild", "Adopted/Legal Guardian", "Other"]),
  relationshipOther: z.string().optional(),
}).refine(data => {
  if (data.relationship === "Other") {
    return !!data.relationshipOther;
  }
  return true;
}, {
  message: "Please specify the relationship",
  path: ["relationshipOther"]
});

// Add Dependents schema
export const addDependentsSchema = z.object({
  addSpouse: z.boolean().default(false),
  spouse: dependentSchema.optional(),
  addDependents: z.boolean().default(false),
  dependents: z.array(dependentSchema).default([]),
}).refine(data => {
  if (data.addSpouse) {
    return !!data.spouse;
  }
  return true;
}, {
  message: "Spouse information is required when adding a spouse",
  path: ["spouse"]
}).refine(data => {
  if (data.addDependents) {
    return data.dependents.length > 0;
  }
  return true;
}, {
  message: "At least one dependent is required when adding dependents",
  path: ["dependents"]
});

// Remove Dependents schema
export const removeDependentsSchema = z.object({
  removeSpouse: z.boolean().default(false),
  spouse: z.object({
    id: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    dateOfBirth: z.string(),
  }).optional(),
  removeDependents: z.boolean().default(false),
  dependents: z.array(z.object({
    id: z.string(),
    lastName: z.string(),
    firstName: z.string(),
    dateOfBirth: z.string(),
  })).default([]),
}).refine(data => {
  if (data.removeSpouse) {
    return !!data.spouse;
  }
  return true;
}, {
  message: "Spouse information is required when removing spouse",
  path: ["spouse"]
}).refine(data => {
  if (data.removeDependents) {
    return data.dependents.length > 0;
  }
  return true;
}, {
  message: "At least one dependent is required when removing dependents",
  path: ["dependents"]
});

// Benefits schema
export const planSchema = z.object({
  id: z.string(),
  name: z.string(),
  premium: z.number(),
  metalLevel: z.enum(["Bronze", "Silver", "Gold", "Platinum"]),
  network: z.string(),
  deductible: z.number(),
  outOfPocketMax: z.number(),
  officeVisitCopay: z.string(),
  specialistCopay: z.string(),
  rxCoverage: z.string(),
});

export const benefitsSchema = z.object({
  changeMedicalPlan: z.boolean().default(false),
  medicalPlanId: z.string().optional(),
  changeDentalPlan: z.boolean().default(false),
  dentalPlanId: z.string().optional(),
  changeVisionPlan: z.boolean().default(false), 
  visionPlanId: z.string().optional(),
}).refine(data => {
  if (data.changeMedicalPlan) {
    return !!data.medicalPlanId;
  }
  return true;
}, {
  message: "Medical plan selection is required",
  path: ["medicalPlanId"]
}).refine(data => {
  if (data.changeDentalPlan) {
    return !!data.dentalPlanId;
  }
  return true;
}, {
  message: "Dental plan selection is required",
  path: ["dentalPlanId"]
}).refine(data => {
  if (data.changeVisionPlan) {
    return !!data.visionPlanId;
  }
  return true;
}, {
  message: "Vision plan selection is required",
  path: ["visionPlanId"]
});

// Special Enrollment schema
export const specialEnrollmentSchema = z.object({
  eventType: z.enum([
    "Loss of Coverage", 
    "Birth/Adoption/Foster Care", 
    "Marriage", 
    "Permanent Move", 
    "Loss of Dependent", 
    "Gain Dependent"
  ]),
  eventDate: z.string().min(1, "Event date is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
});

// Terminate Policy schema
export const terminatePolicySchema = z.object({
  terminatePrimaryApplicant: z.boolean().default(false),
  terminationEffectiveDate: z.string().optional(),
  terminationReason: z.enum(["Medicare Eligible", "Death", "Enrolled in Group Coverage", "Other"]).optional(),
  terminationReasonOther: z.string().optional(),
  cancelMedicalPolicy: z.boolean().default(false),
  medicalCancellationDate: z.string().optional(),
  medicalCancellationReason: z.string().optional(),
  keepDentalVision: z.boolean().default(false),
  cancelDentalPolicy: z.boolean().default(false),
  dentalCancellationDate: z.string().optional(),
  dentalCancellationReason: z.string().optional(),
  cancelVisionPolicy: z.boolean().default(false),
  visionCancellationDate: z.string().optional(),
  visionCancellationReason: z.string().optional(),
}).refine(data => {
  if (data.terminatePrimaryApplicant) {
    return !!data.terminationEffectiveDate && !!data.terminationReason;
  }
  return true;
}, {
  message: "Termination date and reason are required",
  path: ["terminationEffectiveDate", "terminationReason"]
}).refine(data => {
  if (data.terminationReason === "Other") {
    return !!data.terminationReasonOther;
  }
  return true;
}, {
  message: "Please specify the termination reason",
  path: ["terminationReasonOther"]
}).refine(data => {
  if (data.cancelMedicalPolicy) {
    return !!data.medicalCancellationDate && !!data.medicalCancellationReason;
  }
  return true;
}, {
  message: "Medical policy cancellation date and reason are required",
  path: ["medicalCancellationDate", "medicalCancellationReason"]
}).refine(data => {
  if (data.cancelDentalPolicy) {
    return !!data.dentalCancellationDate && !!data.dentalCancellationReason;
  }
  return true;
}, {
  message: "Dental policy cancellation date and reason are required",
  path: ["dentalCancellationDate", "dentalCancellationReason"]
}).refine(data => {
  if (data.cancelVisionPolicy) {
    return !!data.visionCancellationDate && !!data.visionCancellationReason;
  }
  return true;
}, {
  message: "Vision policy cancellation date and reason are required",
  path: ["visionCancellationDate", "visionCancellationReason"]
});

// Main form schema
export const formSchema = z.object({
  meta: metaSchema,
  selections: selectionsSchema,
  personalInfo: personalInfoSchema.optional(),
  dependents: z.object({
    add: addDependentsSchema.optional(),
    remove: removeDependentsSchema.optional(),
  }).optional(),
  benefits: benefitsSchema.optional(),
  specialEnrollment: specialEnrollmentSchema.optional(),
  terminatePolicy: terminatePolicySchema.optional(),
}).refine(data => {
  // If changePersonalInfo is selected, personalInfo must be provided
  if (data.selections.changePersonalInfo && !data.personalInfo) {
    return false;
  }
  return true;
}, {
  message: "Personal information must be provided when selected",
  path: ["personalInfo"]
}).refine(data => {
  // If addDependents or removeDependents is selected, dependents must be provided
  if ((data.selections.addDependents || data.selections.removeDependents) && !data.dependents) {
    return false;
  }
  return true;
}, {
  message: "Dependent information must be provided when selected",
  path: ["dependents"]
}).refine(data => {
  // If changeBenefits is selected, benefits must be provided
  if (data.selections.changeBenefits && !data.benefits) {
    return false;
  }
  return true;
}, {
  message: "Benefits information must be provided when selected",
  path: ["benefits"]
}).refine(data => {
  // If terminatePolicy is selected, terminatePolicy must be provided
  if (data.selections.terminatePolicy && !data.terminatePolicy) {
    return false;
  }
  return true;
}, {
  message: "Termination information must be provided when selected",
  path: ["terminatePolicy"]
}).refine(data => {
  // Special enrollment is required for certain groups and changes
  const isSpecialEnrollmentRequired = data.meta.groupNumber === '129800' && 
    (data.selections.addDependents || data.selections.changeBenefits);
  
  if (isSpecialEnrollmentRequired && !data.specialEnrollment) {
    return false;
  }
  return true;
}, {
  message: "Special enrollment information is required for this change",
  path: ["specialEnrollment"]
});

// Export types
export type Meta = z.infer<typeof metaSchema>;
export type Selections = z.infer<typeof selectionsSchema>;
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type Dependent = z.infer<typeof dependentSchema>;
export type AddDependents = z.infer<typeof addDependentsSchema>;
export type RemoveDependents = z.infer<typeof removeDependentsSchema>;
export type Benefits = z.infer<typeof benefitsSchema>;
export type Plan = z.infer<typeof planSchema>;
export type SpecialEnrollment = z.infer<typeof specialEnrollmentSchema>;
export type TerminatePolicy = z.infer<typeof terminatePolicySchema>;
export type FormData = z.infer<typeof formSchema>;

// Validation helper functions
export function validatePersonalInfo(data: PersonalInfo): { valid: boolean; errors: Record<string, string> | null } {
  const result = personalInfoSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, errors: null };
}

export function validateDependents(data: { add?: AddDependents, remove?: RemoveDependents }): { valid: boolean; errors: Record<string, string> | null } {
  let valid = true;
  const errors: Record<string, string> = {};
  
  if (data.add) {
    const addResult = addDependentsSchema.safeParse(data.add);
    if (!addResult.success) {
      valid = false;
      addResult.error.issues.forEach(issue => {
        const path = `add.${issue.path.join('.')}`;
        errors[path] = issue.message;
      });
    }
  }
  
  if (data.remove) {
    const removeResult = removeDependentsSchema.safeParse(data.remove);
    if (!removeResult.success) {
      valid = false;
      removeResult.error.issues.forEach(issue => {
        const path = `remove.${issue.path.join('.')}`;
        errors[path] = issue.message;
      });
    }
  }
  
  return { valid, errors: Object.keys(errors).length > 0 ? errors : null };
}

export function validateBenefits(data: Benefits): { valid: boolean; errors: Record<string, string> | null } {
  const result = benefitsSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, errors: null };
}

export function validateSpecialEnrollment(data: SpecialEnrollment): { valid: boolean; errors: Record<string, string> | null } {
  const result = specialEnrollmentSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, errors: null };
}

export function validateTerminatePolicy(data: TerminatePolicy): { valid: boolean; errors: Record<string, string> | null } {
  const result = terminatePolicySchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, errors: null };
}

export function validateForm(data: FormData): { valid: boolean; errors: Record<string, string> | null } {
  const result = formSchema.safeParse(data);
  if (!result.success) {
    const errors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path.join('.');
      errors[path] = issue.message;
    });
    return { valid: false, errors };
  }
  return { valid: true, errors: null };
}