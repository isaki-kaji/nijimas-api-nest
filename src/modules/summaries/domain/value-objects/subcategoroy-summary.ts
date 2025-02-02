import { Expense } from 'modules/common/domain/value-objects/expense';
import { Count } from 'modules/common/domain/value-objects/count';
import { ExpenseSummary } from './expense-summary';

export class SubCategorySummary extends ExpenseSummary<string> {
  private constructor(
    private readonly category: string,
    count: Count,
    amount: Expense,
  ) {
    super(count, amount);
  }

  static create(
    category: string,
    count: Count,
    amount: Expense,
  ): SubCategorySummary {
    return new SubCategorySummary(category, count, amount);
  }

  getCategory(): string {
    return this.category;
  }
}
