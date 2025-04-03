import { Uid } from 'modules/common/domain/value-objects/uid';
import { CalculatedSummary } from 'modules/summaries/domain/value-objects/calculated-summary';
import { DailyActivitySummaryResult } from 'modules/summaries/domain/value-objects/daily-activity-summary-result';
import { YearMonth } from 'modules/summaries/domain/value-objects/year-month';
import { MonthlySummaryResponseDto } from '../dto/response/monthly-summary.response.dto';

export class SummariesFactory {
  createResponseDto(
    uid: Uid,
    yearMonth: YearMonth,
    mainCategorySummary: CalculatedSummary[],
    subCategorySummary: CalculatedSummary[],
    dailyActivity: DailyActivitySummaryResult,
  ): MonthlySummaryResponseDto {
    return {
      uid: uid.value,
      year: yearMonth.getYear(),
      month: yearMonth.getMonth(),
      mainCategorySummary: mainCategorySummary.map((summary) => ({
        categoryName: summary.getCategory(),
        count: summary.getCount().value,
        amount: summary.getAmount().value,
        percentage: summary.getPercentage(),
      })),
      subCategorySummary: subCategorySummary.map((summary) => ({
        categoryName: summary.getCategory(),
        count: summary.getCount().value,
        amount: summary.getAmount().value,
        percentage: summary.getPercentage(),
      })),
      dailyCount: dailyActivity.getCounts().map((count) => count.value),
      dailyAmount: dailyActivity.getAmounts().map((amount) => amount.value),
    };
  }
}
