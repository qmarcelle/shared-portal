import { DashboardPriorAuthDetails } from '@/app/dashboard/models/priorAuth_details';
import { formatDateToShortYear } from '@/utils/date_formatter';
import { MemberPriorAuthDetail } from '../models/priorAuthData';
import { PriorAuthDetails } from '../models/priorAuthDetails';
import { PriorAuthType } from '../models/priorAuthType';

export function mapToPriorAuthDetails(item: MemberPriorAuthDetail) {
  return {
    issuer: item['serviceGroupDescription'],
    priorAuthStatus: item['statusDescription'],
    serviceDate: item['fromDate'],
    serviceDateFormatted: formatDateToShortYear(item['fromDate']),
    memberName: item['firstName'] + ' ' + item['lastName'],
    referenceId: item['referenceId'],
    columns: [
      {
        label: 'Referred by',
        value: item.getProviderReferredBy.name,
        defaultValue: 'N/A',
      },
      {
        label: 'Referred to',
        value: item.getProviderReferredTo.name,
        defaultValue: 'N/A',
      },
    ],
    priorAuthTotal: null,
    priorAuthInfo: '',
  } as PriorAuthDetails;
}

export function mapToDashboardAuth(
  priorAuthDetails: MemberPriorAuthDetail,
): DashboardPriorAuthDetails {
  return {
    priorAuthName: priorAuthDetails.serviceGroupDescription ?? '',
    priorAuthType: PriorAuthType.MEDICAL,
    dateOfVisit: formatDateToShortYear(priorAuthDetails.fromDate),
    priorAuthStatus: priorAuthDetails.statusDescription ?? '',
    member: priorAuthDetails.firstName + ' ' + priorAuthDetails.lastName,
    referenceId: priorAuthDetails.referenceId ?? '',
  };
}
