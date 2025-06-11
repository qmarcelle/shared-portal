import { parse } from 'date-fns';
import { MemberPriorAuthDetail } from '../models/priorAuthData';

const customOrder = {
  Denied: 0,
  Pending: 1,
  'Partial Approval': 2,
  Approved: 3,
};

export function sortByStatusWithCompleteLast(
  a: MemberPriorAuthDetail,
  b: MemberPriorAuthDetail,
) {
  const indexA =
    customOrder[a.statusDescription as keyof typeof customOrder] ??
    Object.keys(customOrder).length;
  const indexB =
    customOrder[b.statusDescription as keyof typeof customOrder] ??
    Object.keys(customOrder).length;

  if (indexA !== indexB) {
    return indexA - indexB;
  }
  return (b.statusCode || '').localeCompare(a.statusCode || '');
}

export function sortByStatusCompleteFirst(
  a: MemberPriorAuthDetail,
  b: MemberPriorAuthDetail,
) {
  const indexA =
    customOrder[a.statusDescription as keyof typeof customOrder] ??
    Object.keys(customOrder).length;
  const indexB =
    customOrder[b.statusDescription as keyof typeof customOrder] ??
    Object.keys(customOrder).length;

  if (indexA !== -1 && indexB !== -1) {
    return indexA - indexB;
  } else if (indexA !== -1) {
    return -1;
  } else if (indexB !== -1) {
    return 1;
  }
  return (a.statusCode || '').localeCompare(b.statusCode || '');
}

export function sortByDateHighToLow(
  a: MemberPriorAuthDetail,
  b: MemberPriorAuthDetail,
) {
  const dateA = a.fromDate
    ? parse(a.fromDate, 'MM/dd/yyyy', new Date())
    : new Date(0);
  const dateB = b.fromDate
    ? parse(b.fromDate, 'MM/dd/yyyy', new Date())
    : new Date(0);
  return dateB.getTime() - dateA.getTime();
}

export function sortByDateLowToHigh(
  a: MemberPriorAuthDetail,
  b: MemberPriorAuthDetail,
) {
  const dateA = a.fromDate
    ? parse(a.fromDate, 'MM/dd/yyyy', new Date())
    : new Date(0);
  const dateB = b.fromDate
    ? parse(b.fromDate, 'MM/dd/yyyy', new Date())
    : new Date(0);
  return dateA.getTime() - dateB.getTime();
}
