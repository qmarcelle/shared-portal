export type SmartSearchRequest = {
  inquiry: string;
  query: string;
  qpParams: string;
  sapphire: Sapphire;
  apps: string;
};

type Sapphire = {
  'sapphire.radius': string;
  'sapphire.network_id': string;
  'sapphire.limit': string;
};
