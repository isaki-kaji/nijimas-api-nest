import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class ExpenseSummary<T extends string> {
  constructor(
    private readonly category: T,
    private readonly count: Count,
    private readonly amount: Expense,
  ) {}

  static create<T extends string>(
    category: T,
    count: Count,
    amount: Expense,
  ): ExpenseSummary<T> {
    return new ExpenseSummary(category, count, amount);
  }

  getCategory(): T {
    return this.category;
  }

  getCount(): Count {
    return this.count;
  }

  getAmount(): Expense {
    return this.amount;
  }
}
