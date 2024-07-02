export interface ESDetails {
  componentName: string;
  componentStatus: string;
  returnCode: string;
  subSystemName: string;
  message: string;
  problemTypes: string;
  innerDetails: DetailsInnerDetails;
}

export interface DetailsInnerDetails {
  statusDetails: StatusDetail[];
}

export interface StatusDetail {
  componentName: string;
  componentStatus: string;
  returnCode: string;
  subSystemName: string;
  message: string;
  problemTypes: string;
  innerDetails: StatusDetailInnerDetails;
}

export interface StatusDetailInnerDetails {
  statusDetails: string[];
}
