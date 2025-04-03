import { Injectable } from '@nestjs/common';
import { CalculatedSummary } from './value-objects/calculated-summary';
import { ExpenseSummaryList } from './value-objects/expense-summary-list';
import { DailyActivitySummariesByMonth } from './value-objects/daily-activity-summaries-by-month';
import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';
import { DailyActivitySummaryResult } from './value-objects/daily-activity-summary-result';

@Injectable()
export class SummariesService {
  constructor() {}

  generateCalculatedSummaries(
    summaries: ExpenseSummaryList<string>,
  ): CalculatedSummary[] {
    if (summaries.getSummaries().length === 0) return [];

    const totalAmount = summaries.getTotalAmount();

    if (totalAmount.isZero() || totalAmount.isEqualOrOverMaxValue()) return [];

    const calculatedSummaries = summaries.getSummaries().map((summary) => {
      const count = summary.getCount();
      const amount = summary.getAmount();
      const percentage = amount.outputPercentage(totalAmount);

      return CalculatedSummary.create(
        summary.getCategory(),
        count,
        amount,
        percentage,
      );
    });

    return this.sortSummariesByAmount(calculatedSummaries);
  }

  private sortSummariesByAmount(
    summaries: CalculatedSummary[],
  ): CalculatedSummary[] {
    return [...summaries].sort(
      (a, b) => b.getAmount().value - a.getAmount().value,
    );
  }

  generateDailyActivityLists(
    activities: DailyActivitySummariesByMonth,
  ): DailyActivitySummaryResult {
    const daysInMonth = activities.getDaysInMonth();
    const dailyCounts = new Array(daysInMonth).fill(Count.create(0));
    const dailyAmounts = new Array(daysInMonth).fill(Expense.create(0));

    activities.getSummaries().forEach((summary) => {
      dailyCounts[summary.getDate() - 1] = summary.getCount();
      dailyAmounts[summary.getDate() - 1] = summary.getAmount();
    });

    return DailyActivitySummaryResult.create(dailyCounts, dailyAmounts);
  }
}
