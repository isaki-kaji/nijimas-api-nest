export class Expense {
  private constructor(public readonly value: number) {}

  public static create(value: number): Expense {
    if (value < 0) {
      throw new Error('Expense must be a positive number)');
    }

    if (value > 100000000) {
      throw new Error('Expense must be less than 1000000)');
    }

    return new Expense(value);
  }

  public getValue(): number {
    return this.value;
  }
}
