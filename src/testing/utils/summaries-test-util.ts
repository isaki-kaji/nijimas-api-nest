import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';
import { DailyActivitySummary } from 'modules/summaries/domain/value-objects/daily-activity-summary';
import { SubCategorySummary } from 'modules/summaries/domain/value-objects/subcategoroy-summary';

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

export function generateExpenseSummary(
  category: string,
  count: number,
  amount: number,
): SubCategorySummary {
  return SubCategorySummary.create(
    category,
    Count.create(count),
    Expense.create(amount),
  );
}
