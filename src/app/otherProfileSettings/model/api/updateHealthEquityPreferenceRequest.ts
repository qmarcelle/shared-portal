export interface UpdateHealthEquityPreferenceRequest {
  memberContrivedKey: string;
  subscriberContrivedKey: string;
  groupContrivedKey: string;
  memberPreferenceBy: string;
  dataSource: string;
  userId: string;
  ethnicityCode: string | null;
  raceCode1: string | null;
  raceCode2: string | null;
  raceCode3: string | null;
  raceCode4: string | null;
  raceCode5: string | null;
  raceCode6: string | null;
  engAbilityCode: string | null;
  spokenlanguageCode: string | null;
  writtenlanguageCode: string | null;
  lastUpdateDate: string;
  srcLoadDate: string;
}
