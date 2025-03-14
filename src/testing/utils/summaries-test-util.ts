import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';
import { DailyActivitySummary } from 'modules/summaries/domain/value-objects/daily-activity-summary';
import { ExpenseSummary } from 'modules/summaries/domain/value-objects/expense-summary';

export function genDailyActivitySummary(
  date: number,
  count: number,
  amount: number,
): DailyActivitySummary {
  return DailyActivitySummary.create(
    date,
    Count.create(count),
    Expense.create(amount),
  );
}

export function generateExpenseSummary<T extends string>(
  category: T,
  count: number,
  amount: number,
): ExpenseSummary<T> {
  return ExpenseSummary.create(
    category,
    Count.create(count),
    Expense.create(amount),
  );
}
