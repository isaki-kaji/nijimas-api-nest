import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class CalculatedSummary<T> {
  private constructor(
    private readonly category: T,
    private readonly count: Count,
    private readonly amount: Expense,
    private readonly percentage: number,
  ) {}

  static create<T>(
    category: T,
    count: Count,
    amount: Expense,
    percentage: number,
  ): CalculatedSummary<T> {
    return new CalculatedSummary(category, count, amount, percentage);
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

  getPercentage(): number {
    return this.percentage;
  }
}
