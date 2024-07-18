export interface SmartSearchRequest {
  searchTerm: string;
  credentials?: string;
}
export interface SmartSearchResponse {
  suggestionResponse: string;
}
