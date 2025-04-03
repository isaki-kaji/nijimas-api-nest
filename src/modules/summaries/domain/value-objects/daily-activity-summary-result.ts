import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';

export class DailyActivitySummaryResult {
  private constructor(
    private readonly _counts: Count[],
    private readonly _amounts: Expense[],
  ) {}

  static create(
    counts: Count[],
    amounts: Expense[],
  ): DailyActivitySummaryResult {
    return new DailyActivitySummaryResult(counts, amounts);
  }

  get counts(): Count[] {
    return this._counts;
  }

  get amounts(): Expense[] {
    return this._amounts;
  }
}
