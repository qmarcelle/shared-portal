// app/insurance/change-form/pdf-action.ts
'use server';

/**
 * IHBC Change Form PDF Generation
 *
 * This file contains functions for generating PDFs from form data.
 * Current implementation uses mock/placeholder logic and needs to be replaced
 * with actual PDF generation using a library like pdf-lib or pdfkit.
 *
 * TODO: [CRITICAL] Implement actual PDF generation with all required fields
 * TODO: Create or use an official form template provided by IHBC/BCBS
 * TODO: Implement proper field mapping based on official form structure
 * TODO: Add security headers and metadata to generated PDFs
 */

// Now we can use pdf-lib as it's been installed
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { FormData } from '../../lib/schemas';

// Comment out this line since we don't have this function
// import { getApplicationData } from '@/lib/insurance/stores';

/**
 * Legacy PDF generation function
 *
 * TODO: This function should be replaced or refactored to use the new schema structure
 * TODO: Consolidate with generatePdf function below to avoid duplication
 */
export async function generatePDF(): Promise<Buffer> {
  try {
    // Create a simple PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size

    // Add fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add header
    page.drawText('BLUECROSS BLUESHIELD OF TENNESSEE', {
      x: 50,
      y: 730,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0.7),
    });

    page.drawText('Individual Change Form', {
      x: 50,
      y: 710,
      size: 14,
      font: helveticaBold,
    });

    // Mock content
    page.drawText('This is a mock PDF generated for testing purposes.', {
      x: 50,
      y: 650,
      size: 12,
      font: helveticaFont,
    });

    // Get the PDF as a buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    return Buffer.from('Error generating PDF');
  }
}

/**
 * Generate a PDF from the form data
 *
 * TODO: [CRITICAL] Implement actual PDF generation with proper template
 * TODO: Add header with IHBC/BCBS branding and logos
 * TODO: Ensure all form fields map correctly to the official form
 * TODO: Add page overflow handling for forms with many dependents
 * TODO: Add form metadata for accessibility (PDF/UA compliance)
 */
export async function generatePdf(formData: FormData): Promise<Buffer> {
  try {
    // Create a PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // Letter size

    // Add fonts
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Add header
    page.drawText('BLUECROSS BLUESHIELD OF TENNESSEE', {
      x: 50,
      y: 730,
      size: 16,
      font: helveticaBold,
      color: rgb(0, 0, 0.7),
    });

    page.drawText('Individual Change Form', {
      x: 50,
      y: 710,
      size: 14,
      font: helveticaBold,
    });

    // Meta information
    let yPos = 650;

    page.drawText(`Application ID: ${formData.meta.applicationId || 'N/A'}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: helveticaFont,
    });

    yPos -= 20;

    page.drawText(`Group Number: ${formData.meta.groupNumber || 'N/A'}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: helveticaFont,
    });

    yPos -= 20;

    page.drawText(`Subscriber ID: ${formData.meta.subscriberId || 'N/A'}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: helveticaFont,
    });

    yPos -= 20;

    const submittedDate = formData.meta.submittedDate
      ? new Date(formData.meta.submittedDate).toLocaleDateString()
      : new Date().toLocaleDateString();

    page.drawText(`Date Submitted: ${submittedDate}`, {
      x: 50,
      y: yPos,
      size: 10,
      font: helveticaFont,
    });

    yPos -= 40;

    // Sections based on selections
    page.drawText('Selected Changes:', {
      x: 50,
      y: yPos,
      size: 12,
      font: helveticaBold,
    });

    yPos -= 20;

    // Selected changes
    if (formData.selections.changePersonalInfo) {
      page.drawText('☑ Change Personal Information', {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
      });
      yPos -= 15;
    }

    if (formData.selections.addDependents) {
      page.drawText('☑ Add Dependents', {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
      });
      yPos -= 15;
    }

    if (formData.selections.removeDependents) {
      page.drawText('☑ Remove Dependents', {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
      });
      yPos -= 15;
    }

    if (formData.selections.changeBenefits) {
      page.drawText('☑ Change Benefits', {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
      });
      yPos -= 15;
    }

    if (formData.selections.terminatePolicy) {
      page.drawText('☑ Terminate Policy', {
        x: 50,
        y: yPos,
        size: 10,
        font: helveticaFont,
      });
      yPos -= 15;
    }

    // Get the PDF as a buffer
    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // TODO: Add proper error handling with categorization
    // TODO: Add fallback PDF generation as text for critical cases
    return Buffer.from('Error generating PDF');
  }
}

/**
 * Maps form data to PDF form fields
 *
 * TODO: Update field names to match the official form template
 * TODO: Add comprehensive mapping for all form fields
 * TODO: Handle special formatting requirements (dates, currency, etc.)
 * TODO: Add proper type checking for all fields
 */
function mapFormDataToPdfFields(
  formData: FormData,
): Record<string, string | boolean> {
  const pdfFields: Record<string, string | boolean> = {};

  // Meta information
  pdfFields['ApplicationId'] = formData.meta.applicationId || '';
  pdfFields['GroupNumber'] = formData.meta.groupNumber || '';
  pdfFields['SubscriberId'] = formData.meta.subscriberId || '';
  pdfFields['DateSubmitted'] =
    formData.meta.submittedDate || new Date().toISOString();

  // Selected changes
  pdfFields['ChangePersonalInfo'] = formData.selections.changePersonalInfo;
  pdfFields['AddDependents'] = formData.selections.addDependents;
  pdfFields['RemoveDependents'] = formData.selections.removeDependents;
  pdfFields['ChangeBenefits'] = formData.selections.changeBenefits;
  pdfFields['TerminatePolicy'] = formData.selections.terminatePolicy;

  // Add other fields based on selected changes if needed

  return pdfFields;
}

/**
 * Helper function to add header section to PDF
 *
 * TODO: Implement this function with proper layout and styling
 * TODO: Add IHBC/BCBS logo
 * TODO: Format date fields properly
 */
// async function addHeader(page, formData) {
//   // Implementation would go here
// }

/**
 * Helper function to add selections section to PDF
 *
 * TODO: Implement this function with proper layout and styling
 * TODO: Use checkboxes for selections
 */
// async function addSelections(page, formData) {
//   // Implementation would go here
// }

/**
 * Helper function to format dates for the PDF
 *
 * TODO: Implement with proper locale-specific formatting
 * TODO: Handle invalid date strings gracefully
 */
// function formatDateForPdf(dateString) {
//   // Implementation would go here
// }
