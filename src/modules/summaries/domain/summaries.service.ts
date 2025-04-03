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
    if (summaries.summaries.length === 0) return [];

    const totalAmount = summaries.totalAmount;

    if (totalAmount.isZero() || totalAmount.isEqualOrOverMaxValue()) return [];

    const calculatedSummaries = summaries.summaries.map((summary) => {
      const count = summary.count;
      const amount = summary.amount;
      const percentage = amount.outputPercentage(totalAmount);

      return CalculatedSummary.create(
        summary.category,
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
    return [...summaries].sort((a, b) => b.amount.value - a.amount.value);
  }

  generateDailyActivityLists(
    activities: DailyActivitySummariesByMonth,
  ): DailyActivitySummaryResult {
    const daysInMonth = activities.daysInMonth;
    const dailyCounts = new Array(daysInMonth).fill(Count.create(0));
    const dailyAmounts = new Array(daysInMonth).fill(Expense.create(0));

    activities.summaries.forEach((summary) => {
      dailyCounts[summary.date - 1] = summary.count;
      dailyAmounts[summary.date - 1] = summary.amount;
    });

    return DailyActivitySummaryResult.create(dailyCounts, dailyAmounts);
  }
}
