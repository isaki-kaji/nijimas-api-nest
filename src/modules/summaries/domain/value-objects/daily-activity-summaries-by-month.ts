import { DailyActivitySummary } from './daily-activity-summary';

export class DailyActivitySummariesByMonth {
  private constructor(
    private readonly _summaries: DailyActivitySummary[],
    private readonly _daysInMonth: number,
  ) {
    this.validateSummaries();
  }

  public static create(
    summaries: DailyActivitySummary[],
    daysInMonth: number,
  ): DailyActivitySummariesByMonth {
    if (daysInMonth < 28 || daysInMonth > 31) {
      throw new Error('Invalid number of days in month');
    }
    return new DailyActivitySummariesByMonth(summaries, daysInMonth);
  }

  get summaries(): ReadonlyArray<DailyActivitySummary> {
    return this._summaries.slice();
  }

  get daysInMonth(): number {
    return this._daysInMonth;
  }

  private validateSummaries(): void {
    const hasValidSummary = !this.summaries.some(
      (summary) => summary['date'] < 1 || summary['date'] > this.daysInMonth,
    );

    if (!hasValidSummary) {
      throw new Error('Invalid daily activity summary');
    }
  }
}
