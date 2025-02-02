import { Uid } from 'modules/common/domain/value-objects/uid';
import { CalculatedSummary } from '../value-objects/calculated-summary';
import { MainCategory } from 'modules/common/domain/value-objects/main-category';
import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';
import { DailyActivitySummaryResult } from '../value-objects/daily-activity-summary-result';
import { YearMonth } from '../value-objects/year-month';

export class MonthlySummary {
  constructor(
    private readonly uid: Uid,
    private readonly yearMonth: YearMonth,
    private readonly maincategorySummaries: CalculatedSummary<MainCategory>[],
    private readonly subcategorySummaries: CalculatedSummary<string>[],
    private readonly dailyActivitySummaryResult: DailyActivitySummaryResult,
  ) {}
}
