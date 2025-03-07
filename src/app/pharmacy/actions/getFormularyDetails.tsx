'use server';
import { getLoggedInMember } from '@/actions/memberDetails';
import { auth } from '@/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { logger } from '@/utils/logger';
import fs from 'fs';
import { PharmacyData } from '../models/app/pharmacyData';
import { getFormularyFilter } from './getFormularyFilter';

export async function getFormularyDetails(): Promise<
  ActionResponse<number, PharmacyData>
> {
  const session = await auth();
  try {
    let formularyURL = '';
    const memberDetails = await getLoggedInMember(session);
    let componentname = '';

    if (memberDetails != null) {
      const formularyType = await getFormularyFilter(
        memberDetails,
        session?.user.vRules,
      );
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
    return {
      status: 200,
      data: {
        formularyURL: formularyURL,
        visibilityRules: session?.user.vRules,
      },
    };
  } catch (error) {
    logger.error('Drug list formulary error ', error);
    return {
      status: 400,
      data: {
        formularyURL: '',
        visibilityRules: session?.user.vRules,
      },
    };
  }
}
