import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';
import { MainCategory } from 'modules/common/domain/value-objects/main-category';
import { ExpenseSummary } from './expense-summary';

export class MainCategorySummary extends ExpenseSummary<MainCategory> {
  private constructor(
    private readonly category: MainCategory,
    count: Count,
    amount: Expense,
  ) {
    super(count, amount);
  }

  static create(
    category: MainCategory,
    count: Count,
    amount: Expense,
  ): MainCategorySummary {
    return new MainCategorySummary(category, count, amount);
  }

  getCategory(): MainCategory {
    return this.category;
  }
}
