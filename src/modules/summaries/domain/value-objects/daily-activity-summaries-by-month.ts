import { DailyActivitySummary } from './daily-activity-summary';

export class DailyActivitySummariesByMonth {
  private constructor(
    private readonly summaries: DailyActivitySummary[],
    private readonly daysInMonth: number,
  ) {
    this.validateSummaries();
  }

  public static create(
    summaries: DailyActivitySummary[],
    daysInMonth: number,
  ): DailyActivitySummariesByMonth {
    if (!summaries || summaries.length === 0) {
      throw new Error('Summaries must not be empty');
    }

    if (daysInMonth < 28 || daysInMonth > 31) {
      throw new Error('Invalid number of days in month');
    }
    return new DailyActivitySummariesByMonth(summaries, daysInMonth);
  }

  getSummaries(): ReadonlyArray<DailyActivitySummary> {
    return this.summaries.slice();
  }

  getDaysInMonth(): number {
    return this.daysInMonth;
  }

  private validateSummaries(): void {
    const hasValidSummary = !this.summaries.some(
      (summary) =>
        summary['date'] < 1 || summary['date'] > this.getDaysInMonth(),
    );

    if (!hasValidSummary) {
      throw new Error('Invalid daily activity summary');
    }
  }
}
