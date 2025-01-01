import { IDocumentMetadataListResponse } from '../models/api/document';

export const DocumentListMockResp: IDocumentMetadataListResponse = {
  documentMetadataList: [
    {
      documentIdentifier: '158344913888435884',
      memberId: '90631534101',
      memberMasterPatientIdentifier: '36253292',
      groupId: '130401',
      campaignId: 'GMCLetters',
      taskInfo: [
        {
          fromDate: '2019-12-20',
          toDate: '2024-10-07',
          communicationCategory: 'COVU',
          communicationCategoryDescription: 'Important Coverage Updates',
          taskSequenceNumber: 0,
          communicationInfo: [
            {
              deliveryChannel: 'EXTERNAL',
              documentTitle: 'Coverage Update',
              publicFacingIndicator: 'Y',
            },
          ],
          taskStatusInfo: [
            {
              status: 'SUCCESS',
              statusReason: 'COMPLETE',
            },
          ],
        },
      ],
    },
    {
      documentIdentifier: '15792734969826318',
      memberId: '90631534102',
      memberMasterPatientIdentifier: '36253292',
      groupId: '130401',
      campaignId: 'GMCLetters',
      taskInfo: [
        {
          fromDate: '2019-12-20',
          toDate: '2024-10-07',
          communicationCategory: 'BCIN',
          communicationCategoryDescription: 'Benefits & Coverage Info',
          taskSequenceNumber: 0,
          communicationInfo: [
            {
              deliveryChannel: 'EXTERNAL',
              documentTitle: 'Coverage Update',
              publicFacingIndicator: 'Y',
            },
          ],
          taskStatusInfo: [
            {
              status: 'SUCCESS',
              statusReason: 'COMPLETE',
            },
          ],
        },
      ],
    },
  ],
};
