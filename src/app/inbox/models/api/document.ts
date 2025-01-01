// Interface for individual communication information
interface ICommunicationInfo {
  deliveryChannel: string;
  documentTitle: string;
  publicFacingIndicator: string;
}

// Interface for task status information
interface ITaskStatusInfo {
  status: string;
  statusReason: string;
}

// Interface for task information
export interface ITaskInfo {
  fromDate: string;
  toDate: string;
  communicationCategory: string;
  communicationCategoryDescription: string;
  taskSequenceNumber: number;
  communicationInfo: ICommunicationInfo[];
  taskStatusInfo: ITaskStatusInfo[];
}

// Interface for each document metadata
export interface IDocumentMetadata {
  documentIdentifier: string;
  memberId: string;
  memberMasterPatientIdentifier: string;
  groupId: string;
  campaignId: string;
  taskInfo: ITaskInfo[];
}

// Interface for the document metadata list
export interface IDocumentMetadataListResponse {
  documentMetadataList: IDocumentMetadata[];
}

export interface IMemberInfo {
  name: string;
  id: string;
}

export interface IDocumentFile {
  fileName: string;
  fileFormat: string;
  fileContents: string;
}
