import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class ExpenseSummary<T extends string> {
  constructor(
    private readonly _category: T,
    private readonly _count: Count,
    private readonly _amount: Expense,
  ) {}

  static create<T extends string>(
    category: T,
    count: Count,
    amount: Expense,
  ): ExpenseSummary<T> {
    return new ExpenseSummary(category, count, amount);
  }

  get category(): T {
    return this._category;
  }

  get count(): Count {
    return this._count;
  }

  get amount(): Expense {
    return this._amount;
  }
}
