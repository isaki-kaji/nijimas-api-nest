export class Expense {
  private constructor(private readonly value: number) {}

  public static create(value: number): Expense {
    if (value < 0) {
      throw new Error('Expense must be a positive number.');
    }
    if (value > 100000000) {
      throw new Error('Expense must be less than 100,000,000.');
    }

    return new Expense(value);
  }

  public getValue(): number {
    return this.value;
  }

  isZero(): boolean {
    return this.value === 0;
  }

  isOverOneBillion(): boolean {
    return this.value >= 100000000;
  }

  add(other: Expense): Expense {
    return Expense.create(this.value + other.value);
  }

  outputPercentage(total: Expense): number {
    if (this.isZero() || total.isZero()) return 0;
    return Math.round((this.value / total.value) * 100 * 1000) / 1000;
  }
}
