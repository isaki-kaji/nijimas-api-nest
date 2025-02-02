import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class CalculatedSummary {
  private constructor(
    private readonly category: string,
    private readonly count: Count,
    private readonly amount: Expense,
    private readonly percentage: number,
  ) {}

  static create(
    category: string,
    count: Count,
    amount: Expense,
    percentage: number,
  ): CalculatedSummary {
    return new CalculatedSummary(category, count, amount, percentage);
  }

  getCategory(): string {
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
