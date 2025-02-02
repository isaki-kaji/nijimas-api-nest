import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class DailyActivitySummaryResult {
  private constructor(
    private readonly counts: Count[],
    private readonly amounts: Expense[],
  ) {}

  static create(
    counts: Count[],
    amounts: Expense[],
  ): DailyActivitySummaryResult {
    return new DailyActivitySummaryResult(counts, amounts);
  }

  getCounts(): Count[] {
    return this.counts;
  }

  getAmounts(): Expense[] {
    return this.amounts;
  }
}
