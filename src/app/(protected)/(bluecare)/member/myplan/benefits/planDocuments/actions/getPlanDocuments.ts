'use server';

import { getExternalAppIframeContent } from '@/actions/externalAppIframe';
import { auth } from '@/app/(system)/auth';
import { ActionResponse } from '@/models/app/actionResponse';
import { PlanDocumentsData } from '../models/app/plan_documents_data';

export const getPlanDocuments = async (): Promise<
  ActionResponse<number, PlanDocumentsData>
> => {
  const session = await auth();
  try {
    let iframeContent = await getExternalAppIframeContent(
      'ElectronicEOCWeb/membereoclandingpage.do',
      session?.user.id ?? '',
    );
    if (!iframeContent.includes('Electronic Evidence Of Coverage')) {
      throw new Error('EOC Page is not available');
    }
    iframeContent = iframeContent
      ? iframeContent.replace(
          '<link href="jsp/theme/eocportal.css" rel="stylesheet" type="text/css">',
          `<link href="/css/eoc_portal.css" rel="stylesheet" type="text/css"><base href="${process.env.NEXT_PUBLIC_MEMBER_BASE_HREF}" />`,
        )
      : '';
    return {
      status: 200,
      data: {
        visibilityRules: session?.user.vRules,
        iframeContent: iframeContent,
      },
    };
  } catch (error) {
    return { status: 400, data: { visibilityRules: session?.user.vRules } };
  }
};
