import { FSABean } from '../../model/myHealthCareResponseDTO';
import { SpendingBalanceYearData } from '../../model/spendingBalanceYearData';

export const mapFSABeansToSpendingBalanceBean = (
  fsaBeans: FSABean[],
): {
  planYears: string[];
  yearData: SpendingBalanceYearData[];
} => {
  // Extract unique years from effectiveDate (format 'MM-DD-YYYY')
  const planYears = Array.from(
    new Set(
      fsaBeans
        .map((bean) => {
          const dateParts = bean.effectiveDate?.split('-');
          return dateParts && dateParts.length === 3 ? dateParts[2] : undefined;
        })
        .filter((year): year is string => !!year),
    ),
  );

  // Map each year to its data (assuming one bean per year, or take the latest if multiple)
  const yearData = planYears.map((planYear) => {
    const bean = fsaBeans.find(
      (b) => b.effectiveDate?.split('-')[2] === planYear,
    );
    return {
      planYear,
      contributionsAmount: bean?.totalPledgeAmount ?? '$0.00',
      distributionsAmount: bean?.totalExpenditure ?? '$0.00',
      balanceAmount: bean?.accountBalance ?? '$0.00',
    };
  });

  return {
    planYears,
    yearData,
  };
};
