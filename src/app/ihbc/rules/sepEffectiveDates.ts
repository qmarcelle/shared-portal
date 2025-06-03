import { formatDateToLocale } from '@/utils/date_formatter';
import { SpecialEnrolmentEventEnum } from '../models/SpecialEnrolmentEventEnum';
import { computeStandardEffectiveDate } from './standardEffectiveDate';

export function computeSepEffectiveDates(
  event: SpecialEnrolmentEventEnum,
  selectedDate: string,
): string[] {
  const today = new Date();
  const givenDate = new Date(selectedDate);
  const allowedDates: Date[] = [];
  switch (event) {
    case SpecialEnrolmentEventEnum.lossOfCoverage:
      givenDate.setMonth(givenDate.getMonth() + 1);
      givenDate.setDate(1);
      allowedDates.push(givenDate);
      break;

    case SpecialEnrolmentEventEnum.birthOrAdoption:
      // Standard dates
      allowedDates.push(computeStandardEffectiveDate());
      // Event Date itself
      allowedDates.push(givenDate);
      // 1st day of month after event
      givenDate.setMonth(givenDate.getMonth() + 1);
      givenDate.setDate(1);
      allowedDates.push(givenDate);
      break;

    case SpecialEnrolmentEventEnum.marriage:
      // 1st day of next month after event
      givenDate.setMonth(givenDate.getMonth() + 1);
      givenDate.setDate(1);
      // 1st day of month after application
      //TODO: Impl
      allowedDates.push(givenDate);
      break;

    case SpecialEnrolmentEventEnum.permanentMove:
      // Standard Date
      allowedDates.push(computeStandardEffectiveDate());
      // 1st day of month after event
      givenDate.setMonth(givenDate.getMonth() + 1);
      givenDate.setDate(1);
      allowedDates.push(givenDate);
      break;

    case SpecialEnrolmentEventEnum.lossOfDep:
      today.setMonth(today.getMonth() + 1);
      today.setDate(1);
      allowedDates.push(today);
      allowedDates.push(computeStandardEffectiveDate());
      break;

    case SpecialEnrolmentEventEnum.gainDep:
      allowedDates.push(givenDate);
      allowedDates.push(computeStandardEffectiveDate());
      break;
  }

  return allowedDates.map((item) => formatDateToLocale(item));
}
