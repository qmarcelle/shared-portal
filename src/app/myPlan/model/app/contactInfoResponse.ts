export type ContactInfoResponse = {
  msg: string;
  data: ContactInfoData;
};

export type ContactInfoData = {
  umpi: string;
  email: string;
  phone: string;
  email_verified_flag: boolean;
  phone_verified_flag: boolean;
};
