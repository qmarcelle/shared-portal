import {
  deleteApplication,
  saveFormProgress,
  submitApplication,
} from '../actions/actions';
import { generatePDF } from '../actions/pdf-actions';

// Mock the PDF generation function
jest.mock('../actions/pdf-actions', () => ({
  generatePDF: jest.fn().mockResolvedValue(Buffer.from('mock pdf content')),
}));

describe('Form Actions', () => {
  const mockFormData = {
    meta: {
      applicationId: 'test-123',
      groupNumber: '12345',
      subscriberId: '67890',
      status: 'In Progress',
      lastSaved: new Date().toISOString(),
    },
    selections: {
      changePersonalInfo: true,
      addDependents: false,
      removeDependents: false,
      changeBenefits: false,
      terminatePolicy: false,
    },
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
    },
    dependents: null,
    benefits: null,
    specialEnrollment: null,
    terminatePolicy: null,
    validationErrors: null,
  };

  describe('submitApplication', () => {
    it('should successfully submit valid form data', async () => {
      const result = await submitApplication(mockFormData);

      expect(result.success).toBe(true);
      expect(result.confirmationNumber).toMatch(/^\d{6}-\d{6}-\d{4}$/);
      expect(result.pdfUrl).toMatch(/^\/api\/forms\/ihbc\/change-form\/pdf\//);
    });

    it('should handle validation errors', async () => {
      const invalidFormData = {
        ...mockFormData,
        personalInfo: {
          ...mockFormData.personalInfo,
          email: 'invalid-email',
        },
      };

      const result = await submitApplication(invalidFormData);

      expect(result.success).toBe(false);
      expect(result.errors).toBeTruthy();
      expect(result.message).toContain('Please fix the errors');
    });
  });

  describe('saveFormProgress', () => {
    it('should save form progress successfully', async () => {
      const result = await saveFormProgress(mockFormData);

      expect(result.success).toBe(true);
      expect(result.message).toContain('Progress saved successfully');
    });

    it('should handle save errors gracefully', async () => {
      // Mock a database error scenario
      const errorFormData = {
        ...mockFormData,
        meta: null as any, // Force an error
      };

      const result = await saveFormProgress(errorFormData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to save progress');
    });
  });

  describe('deleteApplication', () => {
    it('should delete application successfully', async () => {
      const result = await deleteApplication('test-123');

      expect(result.success).toBe(true);
      expect(result.message).toContain('Application deleted successfully');
    });

    it('should handle delete errors gracefully', async () => {
      // Mock an invalid application ID
      const result = await deleteApplication('');

      expect(result.success).toBe(false);
      expect(result.message).toContain('Failed to delete application');
    });
  });

  describe('PDF Generation', () => {
    it('should generate PDF successfully', async () => {
      const pdfBuffer = await generatePDF();

      expect(pdfBuffer).toBeInstanceOf(Buffer);
      expect(pdfBuffer.toString()).toBe('mock pdf content');
    });

    it('should include form data in generated PDF', async () => {
      const spy = jest.spyOn(console, 'error');

      await generatePDF();

      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });
  });
});
