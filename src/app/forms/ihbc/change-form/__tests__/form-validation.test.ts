import { validateForm } from '../../lib/schemas';

describe('Form Validation', () => {
  const validFormData = {
    meta: {
      applicationId: 'test-123',
      groupNumber: '12345',
      subscriberId: '67890',
      status: 'In Progress',
      lastSaved: new Date().toISOString(),
    },
    selections: {
      changePersonalInfo: true,
      addDependents: true,
      removeDependents: false,
      changeBenefits: true,
      terminatePolicy: false,
    },
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      dateOfBirth: '1980-01-01',
      tobaccoUse: false,
    },
    dependents: {
      add: {
        addSpouse: true,
        spouse: {
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: '1982-01-01',
          relationship: 'spouse',
        },
        addDependents: false,
        dependents: [],
      },
      remove: null,
    },
    benefits: {
      selectedPlan: 'silver',
      coverageLevel: 'family',
      effectiveDate: '2024-05-01',
      primaryCare: 30,
      specialist: 60,
      deductible: 3000,
      outOfPocket: 8000,
      monthlyPremium: 350,
    },
    specialEnrollment: null,
    terminatePolicy: null,
  };

  describe('Schema Validation', () => {
    it('should validate a complete and valid form', () => {
      const result = validateForm(validFormData);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeNull();
    });

    it('should validate required fields based on selections', () => {
      const formData = {
        ...validFormData,
        personalInfo: null,
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors).toHaveProperty('personalInfo');
      expect(result.errors?.personalInfo).toContain(
        'Personal information is required when changePersonalInfo is selected',
      );
    });

    it('should validate email format', () => {
      const formData = {
        ...validFormData,
        personalInfo: {
          ...validFormData.personalInfo,
          email: 'invalid-email',
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.personalInfo).toContain('Invalid email format');
    });

    it('should validate phone number format', () => {
      const formData = {
        ...validFormData,
        personalInfo: {
          ...validFormData.personalInfo,
          phone: '123', // Invalid phone
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.personalInfo).toContain(
        'Phone number must be 10 digits',
      );
    });
  });

  describe('Cross-field Validation', () => {
    it('should validate spouse age difference', () => {
      const formData = {
        ...validFormData,
        dependents: {
          ...validFormData.dependents,
          add: {
            ...validFormData.dependents.add,
            spouse: {
              ...validFormData.dependents.add.spouse,
              dateOfBirth: '2010-01-01', // Too young
            },
          },
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.dependents).toContain(
        'Spouse must be at least 18 years old',
      );
    });

    it('should validate dependent age limits', () => {
      const formData = {
        ...validFormData,
        dependents: {
          ...validFormData.dependents,
          add: {
            ...validFormData.dependents.add,
            addDependents: true,
            dependents: [
              {
                firstName: 'Child',
                lastName: 'Doe',
                dateOfBirth: '1980-01-01', // Too old
                relationship: 'child',
              },
            ],
          },
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.dependents).toContain(
        'Dependent children must be under 26 years old',
      );
    });

    it('should validate coverage level matches dependents', () => {
      const formData = {
        ...validFormData,
        benefits: {
          ...validFormData.benefits,
          coverageLevel: 'individual',
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.benefits).toContain(
        'Coverage level must be family when adding dependents',
      );
    });

    it('should validate special enrollment date rules', () => {
      const formData = {
        ...validFormData,
        specialEnrollment: {
          eventType: 'birth',
          eventDate: '2024-01-15',
          effectiveDate: '2024-03-01', // Too late
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.specialEnrollment).toContain(
        'Effective date must be within 30 days of qualifying event',
      );
    });
  });

  describe('Business Rule Validation', () => {
    it('should validate tobacco use premium adjustment', () => {
      const formData = {
        ...validFormData,
        personalInfo: {
          ...validFormData.personalInfo,
          tobaccoUse: true,
        },
        benefits: {
          ...validFormData.benefits,
          selectedPlan: 'silver',
          coverageLevel: 'individual',
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(true);
      expect(formData.benefits.primaryCare).toBe(30); // Base copay
      // Premium should be adjusted for tobacco use
      expect(formData.benefits.monthlyPremium).toBeGreaterThan(
        validFormData.benefits.monthlyPremium,
      );
    });

    it('should validate maximum dependent count', () => {
      const formData = {
        ...validFormData,
        dependents: {
          ...validFormData.dependents,
          add: {
            ...validFormData.dependents.add,
            addDependents: true,
            dependents: Array(11).fill({
              firstName: 'Child',
              lastName: 'Doe',
              dateOfBirth: '2010-01-01',
              relationship: 'child',
            }),
          },
        },
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.dependents).toContain(
        'Maximum of 10 dependents allowed',
      );
    });

    it('should validate waiting period exceptions', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);

      const formData = {
        ...validFormData,
        benefits: {
          ...validFormData.benefits,
          effectiveDate: futureDate.toISOString().split('T')[0],
        },
        specialEnrollment: null,
      };

      const result = validateForm(formData);
      expect(result.valid).toBe(false);
      expect(result.errors?.benefits).toContain(
        'Must be at least 30 days from today unless qualifying event',
      );
    });
  });
});
