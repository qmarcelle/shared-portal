'use server';
import { getMemberDetails } from '@/actions/memberDetails';
import { logger } from '@/utils/logger';
import fs from 'fs';
import { getFormularyFilter } from './getFormularyFilter';

export async function getFormularyDetails(): Promise<string> {
  try {
    let formularyURL = '';
    const memberDetails = await getMemberDetails();
    let componentname = '';

    if (memberDetails != null) {
      const formularyType = await getFormularyFilter(memberDetails);
      componentname = formularyType + '-DrugFormularyPDF';

      console.log('formularytype' + componentname);
      const folderPath = `./public/assets/formularies/${componentname}`;
      console.log(folderPath);
      if (fs.existsSync(folderPath)) {
        formularyURL = componentname;
      } else {
        formularyURL = 'Default-DrugFormularyPDF';
      }
    }
    return formularyURL;
  } catch (error) {
    logger.error('Drug list formulary error ', error);
    return '';
  }
}
