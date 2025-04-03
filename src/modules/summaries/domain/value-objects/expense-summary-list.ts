import { Expense } from 'modules/common/domain/value-objects/expense';
import { ExpenseSummary } from './expense-summary';

export class ExpenseSummaryList<T extends string> {
  private constructor(private readonly _summaries: ExpenseSummary<T>[]) {
    this.validateUniqueCategories(_summaries);
    this._summaries = _summaries;
  }

  static create<T extends string>(
    summaries: ExpenseSummary<T>[],
  ): ExpenseSummaryList<T> {
    return new ExpenseSummaryList<T>(summaries);
  }

  get summaries(): ReadonlyArray<ExpenseSummary<T>> {
    return this._summaries.slice();
  }

  private validateUniqueCategories(summaries: ExpenseSummary<T>[]) {
    const categories = summaries.map((summary) => summary.category);
    const uniqueCategories = new Set(categories);
    if (categories.length !== uniqueCategories.size) {
      throw new Error('Categories must be unique');
    }
  }

  get totalAmount(): Expense {
    return this.summaries.reduce(
      (total, summary) => total.add(summary.amount),
      Expense.create(0),
    );
  }
}
