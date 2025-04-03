export class Expense {
  private constructor(private readonly _value: number) {}
  private static readonly maxValue = 100000000;
  private static readonly minValue = 0;

  public static create(value: number): Expense {
    if (value < Expense.minValue) {
      throw new Error('Expense must be a positive number.');
    }
    if (value > Expense.maxValue) {
      throw new Error('Expense must be less than 100,000,000.');
    }

    return new Expense(value);
  }

  get value(): number {
    return this._value;
  }

  isZero(): boolean {
    return this.value === Expense.minValue;
  }

  isEqualOrOverMaxValue(): boolean {
    return this.value >= Expense.maxValue;
  }

  add(other: Expense): Expense {
    return Expense.create(this.value + other.value);
  }

  outputPercentage(total: Expense): number {
    if (this.isZero() || total.isZero()) return 0;
    return Math.round((this.value / total.value) * 100 * 1000) / 1000;
  }
}
