import { Inject, Injectable } from '@nestjs/common';
import { SummariesService } from '../domain/summaries.service';
import { ISummariesRepository } from '../domain/i.summaries.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';

import moment from 'moment-timezone';
import { ExpenseSummaryList } from '../domain/value-objects/expense-summary-list';
import { MainCategory } from 'modules/common/domain/value-objects/main-category';
import { CalculatedSummary } from '../domain/value-objects/calculated-summary';
import { DailyActivitySummariesByMonth } from '../domain/value-objects/daily-activity-summaries-by-month';
import { MonthlySummary } from '../domain/models/monthly-summary';
import { DailyActivitySummaryResult } from '../domain/value-objects/daily-activity-summary-result';
import { YearMonth } from '../domain/value-objects/year-month';

@Injectable()
export class SummariesUseCase {
  constructor(
    private readonly service: SummariesService,
    @Inject('ISummariesRepository')
    private readonly repository: ISummariesRepository,
  ) {}

  async outputMonthlySummary(
    uidStr: string,
    yearStr: string,
    monthStr: string,
    timezone: string,
  ): Promise<MonthlySummary> {
    const uid = Uid.create(uidStr);
    const yearMonth = YearMonth.create(Number(yearStr), Number(monthStr));

    const startDate = yearMonth.getStartDate(timezone);
    const endDate = yearMonth.getEndDate(timezone);
    const daysInMonth = yearMonth.getDaysInMonth(timezone);

    const calculatedMainCategorySummary =
      await this.outputCalculatedMainCategorySummary(uid, startDate, endDate);

    const calculatedSubCategorySummary =
      await this.outputCalculatedSubCategorySummary(uid, startDate, endDate);

    const dailyActivityResult = await this.outputDailyActivitySummaries(
      uid,
      startDate,
      endDate,
      daysInMonth,
    );

    return new MonthlySummary(
      uid,
      yearMonth,
      calculatedMainCategorySummary,
      calculatedSubCategorySummary,
      dailyActivityResult,
    );
  }

  private async outputCalculatedMainCategorySummary(
    uid: Uid,
    startDate: moment.Moment,
    endDate: moment.Moment,
  ): Promise<CalculatedSummary<MainCategory>[]> {
    const mainCategorySummaries =
      await this.repository.getMainCategorySummaryByMonth(
        uid,
        startDate.toDate(),
        endDate.toDate(),
      );

    const mainCategorySummaryList = ExpenseSummaryList.create(
      mainCategorySummaries,
    );

    return this.service.generateCalculatedSummaries(mainCategorySummaryList);
  }

  private async outputCalculatedSubCategorySummary(
    uid: Uid,
    startDate: moment.Moment,
    endDate: moment.Moment,
  ): Promise<CalculatedSummary<string>[]> {
    const subCategorySummaries =
      await this.repository.getSubCategorySummaryByMonth(
        uid,
        startDate.toDate(),
        endDate.toDate(),
      );

    const subCategorySummaryList =
      ExpenseSummaryList.create(subCategorySummaries);

    return this.service.generateCalculatedSummaries(subCategorySummaryList);
  }

  private async outputDailyActivitySummaries(
    uid: Uid,
    startDate: moment.Moment,
    endDate: moment.Moment,
    daysInMonth: number,
  ): Promise<DailyActivitySummaryResult> {
    const summaries = await this.repository.GetDailyActivitySummaryByMonth(
      uid,
      startDate.toDate(),
      endDate.toDate(),
    );
    const dailyActivitySummaryList = DailyActivitySummariesByMonth.create(
      summaries,
      daysInMonth,
    );

    return this.service.generateDailyActivityLists(dailyActivitySummaryList);
  }
}
