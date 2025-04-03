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
      year: yearMonth.year,
      month: yearMonth.month,
      mainCategorySummary: mainCategorySummary.map((summary) => ({
        categoryName: summary.category,
        count: summary.count.value,
        amount: summary.amount.value,
        percentage: summary.percentage,
      })),
      subCategorySummary: subCategorySummary.map((summary) => ({
        categoryName: summary.category,
        count: summary.count.value,
        amount: summary.amount.value,
        percentage: summary.percentage,
      })),
      dailyCount: dailyActivity.counts.map((count) => count.value),
      dailyAmount: dailyActivity.amounts.map((amount) => amount.value),
    };
  }
}
