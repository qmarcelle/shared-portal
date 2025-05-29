export interface DocumentKeyRequest {
  targetApp: string;
  folderName: string;
  docType: string;
  subscriberId: string;
  userId: string;
  docSearchParams: DocSearchParam[];
}

export interface DocSearchParam {
  searchKey: string;
  searchValue: string;
  searchOperand: string;
}
