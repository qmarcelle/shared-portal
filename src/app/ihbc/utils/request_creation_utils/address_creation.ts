import { Address } from '../../models/Address';
import { IHBCSchema } from '../../rules/schema';

export function createAddress({
  type,
  data,
  userId,
  subscriberId,
  applicationDate,
  applicationId,
}: {
  type: string;
  data:
    | NonNullable<
        NonNullable<
          NonNullable<IHBCSchema>['changePersonalInfo']
        >['changeAddress']
      >['residence']
    | NonNullable<
        NonNullable<
          NonNullable<IHBCSchema>['changePersonalInfo']
        >['changeAddress']
      >['mailing'];
  userId: string;
  subscriberId: string;
  applicationDate: string;
  applicationId: string;
}): Address | null {
  if (!data) {
    return null;
  }
  return {
    subscriberAddressInd: type,
    cityName: data?.city,
    countyName: (data as any)?.county,
    statename: data?.state,
    streetName: data?.street,
    zipCode: data?.zip,
    applicationId: applicationId,
    appSubmittedDate: applicationDate,
    subscriberId: subscriberId,
    userId: userId,
  };
}
