// lib/insurance/utils.ts
export async function getCountyForZipCode(zipCode: string): Promise<string[] | null> {
  // This would typically be an API call to a zip code database
  // For demo purposes, we're using a static mapping of TN zip codes to counties
  
  const tnZipCodeMap: Record<string, string[]> = {
    '37201': ['Davidson'],
    '37202': ['Davidson'],
    '37203': ['Davidson'],
    '37204': ['Davidson'],
    '37205': ['Davidson'],
    '37206': ['Davidson'],
    '37207': ['Davidson'],
    '37208': ['Davidson'],
    '37209': ['Davidson'],
    '37210': ['Davidson'],
    '37211': ['Davidson'],
    '37212': ['Davidson'],
    '37213': ['Davidson'],
    '37214': ['Davidson'],
    '37215': ['Davidson'],
    '37216': ['Davidson'],
    '37217': ['Davidson'],
    '37218': ['Davidson'],
    '37219': ['Davidson'],
    '37220': ['Davidson'],
    '37221': ['Davidson'],
    '37027': ['Davidson', 'Williamson'],  // Example of zip code with multiple counties
    '37064': ['Williamson'],
    '37067': ['Williamson'],
    '37069': ['Williamson'],
    '37174': ['Williamson'],
    '37179': ['Williamson'],
    '37215': ['Davidson'],
    '37221': ['Davidson'],
    '37402': ['Hamilton'],
    '37403': ['Hamilton'],
    '37404': ['Hamilton'],
    '37405': ['Hamilton'],
    '37406': ['Hamilton'],
    '37407': ['Hamilton'],
    '37408': ['Hamilton'],
    '37409': ['Hamilton'],
    '37410': ['Hamilton'],
    '37411': ['Hamilton'],
    '37412': ['Hamilton'],
    '37415': ['Hamilton'],
    '37416': ['Hamilton'],
    '37419': ['Hamilton'],
    '37421': ['Hamilton'],
    // Add more TN zip codes as needed
  };
  
  // Check if it's a TN zip code
  const firstThree = zipCode.substring(0, 3);
  if (firstThree === '370' || firstThree === '371' || firstThree === '372' || 
      firstThree === '373' || firstThree === '374' || firstThree === '375' || 
      firstThree === '376' || firstThree === '377' || firstThree === '378' || 
      firstThree === '379' || firstThree === '380' || firstThree === '381' || 
      firstThree === '382' || firstThree === '383') {
    
    return tnZipCodeMap[zipCode] || [''];
  }
  
  return null; // Not a TN zip code
}

// Enhanced Address Change Component
// components/insurance-form/personal-info/address-change.tsx
'use client';

import { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField } from '@/components/ui/form-field';
import { getCountyForZipCode } from '@/lib/insurance/utils';

export function AddressChange() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const [counties, setCounties] = useState<string[]>([]);
  const [isTnZipCode, setIsTnZipCode] = useState(false);
  
  // Watch for zip code changes
  const residenceZip = watch('personalInfo.residenceAddress.zip');
  
  // Auto-populate county field for TN zip codes
  useEffect(() => {
    if (residenceZip?.length === 5) {
      getCountyForZipCode(residenceZip).then(result => {
        if (result) {
          setIsTnZipCode(true);
          setCounties(result);
          
          // If only one county, auto-select it
          if (result.length === 1) {
            setValue('personalInfo.residenceAddress.county', result[0]);
          }
        } else {
          setIsTnZipCode(false);
          setCounties([]);
        }
      });
    }
  }, [residenceZip, setValue]);

  return (
    <div>
      <h4 className="font-medium text-lg mb-2">Residence Address</h4>
      <p className="text-sm text-gray-600 mb-4">No PO Boxes are accepted.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="col-span-2">
          <FormField
            name="personalInfo.residenceAddress.street"
            label="Street Address"
            required
            className="mb-4"
          />
        </div>
        
        <FormField
          name="personalInfo.residenceAddress.city"
          label="City"
          required
          className="mb-4"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            name="personalInfo.residenceAddress.state"
            label="State"
            type="select"
            required
            className="mb-4"
          >
            <option value="">Select a state</option>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            {/* Add all states */}
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            {/* Remaining states */}
          </FormField>
          
          <FormField
            name="personalInfo.residenceAddress.zip"
            label="ZIP Code"
            required
            className="mb-4"
          />
        </div>
        
        <FormField
          name="personalInfo.residenceAddress.county"
          label="County"
          type={counties.length > 1 ? "select" : "text"}
          required
          disabled={counties.length === 1 && isTnZipCode}
          className="mb-4"
        >
          {counties.length > 1 && (
            <>
              <option value="">Select county</option>
              {counties.map(county => (
                <option key={county} value={county}>{county}</option>
              ))}
            </>
          )}
        </FormField>
      </div>
      
      {/* Similar sections for mailing and billing addresses */}
    </div>
  );
}