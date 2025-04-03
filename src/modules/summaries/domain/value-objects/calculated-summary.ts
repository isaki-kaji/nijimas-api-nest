import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class CalculatedSummary {
  private constructor(
    private readonly _category: string,
    private readonly _count: Count,
    private readonly _amount: Expense,
    private readonly _percentage: number,
  ) {}

  static create(
    category: string,
    count: Count,
    amount: Expense,
    percentage: number,
  ): CalculatedSummary {
    return new CalculatedSummary(category, count, amount, percentage);
  }

  get category(): string {
    return this._category;
  }

  get count(): Count {
    return this._count;
  }

  get amount(): Expense {
    return this._amount;
  }

  get percentage(): number {
    return this._percentage;
  }
}
