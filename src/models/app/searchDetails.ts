export interface SearchDetails {
  header: string;
  content: SearchItem[];
}

export type SearchItem = {
  label: string;
  url: string;
  metadata?: string;
};
