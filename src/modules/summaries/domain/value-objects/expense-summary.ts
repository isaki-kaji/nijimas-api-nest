import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export abstract class ExpenseSummary<T> {
  constructor(
    protected readonly count: Count,
    protected readonly amount: Expense,
  ) {}

  abstract getCategory(): T;

  getCount(): Count {
    return this.count;
  }

  getAmount(): Expense {
    return this.amount;
  }
}
