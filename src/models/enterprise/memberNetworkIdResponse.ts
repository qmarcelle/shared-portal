export type MemberNetworkIdResponse = {
  settings: MemberNetworkSetting[];
};

export type MemberNetworkSetting = {
  allowable_networks: AllowableNetworks;
};

export type AllowableNetworks = {
  default: Default[];
};

export type Default = {
  name: null | string;
  id: number;
};
