import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class DailyActivitySummary {
  private constructor(
    private readonly date: number,
    private readonly count: Count,
    private readonly amount: Expense,
  ) {}

  static create(
    date: number,
    count: Count,
    amount: Expense,
  ): DailyActivitySummary {
    return new DailyActivitySummary(date, count, amount);
  }

  getDate(): number {
    return this.date;
  }

  getCount(): Count {
    return this.count;
  }

  getAmount(): Expense {
    return this.amount;
  }
}
