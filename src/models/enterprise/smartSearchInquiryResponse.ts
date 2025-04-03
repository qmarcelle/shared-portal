export type SmartSearchInquiryResult = {
  inquiryResponse: string;
};

export type SmartSearchInquiryResponse = {
  fusion?: Fusion;
  response: Response;
};

export type Fusion = {
  banner: string[];
};

export type Banner = {
  url: string;
  zone: string;
};

export type Response = {
  docs: Doc[];
  numFound: number;
  start: number;
  maxScore: number;
  numFoundExact: boolean;
};

export type Doc = {
  parent_s: string;
  data_source: string;
  mime_type: string;
  id: string;
  fetchedDate_dt: string;
  score: number;
  title?: string;
  description?: string;
};
