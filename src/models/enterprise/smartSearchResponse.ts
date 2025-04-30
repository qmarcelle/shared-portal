export interface SmartSearchResponse {
  data: Record<string, unknown>;
  status: number;
}

export type SmartSearchSuggestionResponse = {
  fusion: Fusion;
  grouped: Grouped;
  terms: Terms;
  responseHeader: ResponseHeader;
  highlighting: { [key: string]: Terms | any };
  facet_counts: FacetCounts;
};

export type FacetCounts = {
  facet_queries: Facet;
  facet_fields: FacetFields;
  facet_ranges: Facet;
  facet_intervals: Facet;
  facet_heatmaps: Facet;
};

export type FacetFields = {
  ta_type: Array<number | string>;
  type: Array<number | string>;
};

export type Facet = Record<string, unknown>;

export type Fusion = {
  qtime: string[];
  params: string[];
  sapphire: Sapphire;
};

export type Sapphire = {
  providers: { [key: string]: Provider };
  specialties: { [key: string]: Specialty };
  searchUrl: string;
};

export type Provider = {
  id: number;
  provider_id: string;
  name: string;
  type: string;
  specialty: string;
  primary_field_specialty: string;
  url: string;
};

export type Specialty = {
  id: number;
  name: string;
  url: string;
};

export type Grouped = {
  cleantitle_lc_s: CleantitleLcS;
};

export type CleantitleLcS = {
  doclist: Doclist;
  matches: number;
};

export type Doclist = {
  numFound: number;
  start: number;
  maxScore: number;
  numFoundExact: boolean;
  docs: Doc[];
};

export type Doc = {
  ta_type: string;
  type: string;
  id: string;
  title: string;
  score: number;
};

export type Terms = {
  value_t: string[];
};

export type ResponseHeader = {
  zkConnected: boolean;
  QTime: number;
  totalTime: number;
  params: any;
  status: number;
};
