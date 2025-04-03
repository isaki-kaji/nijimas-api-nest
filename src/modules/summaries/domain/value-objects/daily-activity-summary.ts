import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class DailyActivitySummary {
  private constructor(
    private readonly _date: number,
    private readonly _count: Count,
    private readonly _amount: Expense,
  ) {}

  static create(
    date: number,
    count: Count,
    amount: Expense,
  ): DailyActivitySummary {
    return new DailyActivitySummary(date, count, amount);
  }

  get date(): number {
    return this._date;
  }

  get count(): Count {
    return this._count;
  }

  get amount(): Expense {
    return this._amount;
  }
}
