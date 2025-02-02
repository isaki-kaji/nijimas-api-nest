import { Expense } from 'modules/common/domain/value-objects/expense';
import { ExpenseSummary } from './expense-summary';

export class ExpenseSummaryList<T extends ExpenseSummary<any>> {
  private constructor(private readonly summaries: T[]) {
    this.validateUniqueCategories(summaries);
    this.summaries = summaries;
  }

  static create<T extends ExpenseSummary<any>>(
    summaries: T[],
  ): ExpenseSummaryList<T> {
    return new ExpenseSummaryList<T>(summaries);
  }

  getSummaries(): ReadonlyArray<ExpenseSummary<T>> {
    return this.summaries.slice();
  }

  private validateUniqueCategories(summaries: ExpenseSummary<T>[]) {
    const categories = summaries.map((summary) => summary.getCategory());
    const uniqueCategories = new Set(categories);
    if (categories.length !== uniqueCategories.size) {
      throw new Error('Categories must be unique');
    }
  }

  getTotalAmount(): Expense {
    return this.summaries.reduce(
      (total, summary) => total.add(summary.getAmount()),
      Expense.create(0),
    );
  }
}
