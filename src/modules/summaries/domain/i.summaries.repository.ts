import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategorySummary } from './value-objects/maincategory-summary';
import { SubCategorySummary } from './value-objects/subcategoroy-summary';
import { DailyActivitySummary } from './value-objects/daily-activity-summary';

export interface ISummariesRepository {
  getMainCategorySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<MainCategorySummary[]>;

  getSubCategorySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<SubCategorySummary[]>;

  GetDailyActivitySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyActivitySummary[]>;
}
