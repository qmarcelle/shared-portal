import { getDocumentKey } from '@/actions/documentKey';
import {
  DocSearchParam,
  DocumentKeyRequest,
} from '@/models/documentKey_details';
import { APP_NAME_DOC_SERVICE, OPERAND_EQUAL } from '@/utils/constants';
import { logger } from '@/utils/logger';

export async function getDocumentURL(
  claimId: string,
  subsId: string,
  userId: string,
): Promise<string> {
  try {
    const docSearchParams: DocSearchParam[] = [
      {
        searchKey: 'Claim Number',
        searchValue: claimId,
        searchOperand: OPERAND_EQUAL,
      },
      {
        searchKey: 'Subscriber ID',
        searchValue: subsId,
        searchOperand: OPERAND_EQUAL,
      },
    ];

    const docKeyReq: DocumentKeyRequest = {
      targetApp: APP_NAME_DOC_SERVICE,
      folderName: process.env.DOC_KEY_CLAIMS_DOC_FOLDER ?? '',
      docType: process.env.DOC_KEY_DOC_TYPE ?? '',
      subscriberId: subsId,
      userId,
      docSearchParams,
    };

    const documentKey = await getDocumentKey(docKeyReq);

    return `${process.env.NEXT_PUBLIC_EWSAPPS_URL}${process.env.DOC_KEY_DOC_PATH}documentRequestKey=${documentKey}`;
  } catch (error) {
    logger.error('getDocumentURL API failed', error);
    return '';
  }
}
