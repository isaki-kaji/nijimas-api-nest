import { Uid } from 'modules/common/domain/value-objects/uid';
import { DailyActivitySummary } from './value-objects/daily-activity-summary';
import { ExpenseSummary } from './value-objects/expense-summary';

export interface ISummariesRepository {
  getMainCategorySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseSummary<MainCategory>[]>;

  getSubCategorySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<ExpenseSummary<string>[]>;

  GetDailyActivitySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyActivitySummary[]>;
}
