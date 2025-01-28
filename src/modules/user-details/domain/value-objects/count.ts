export class Count {
  private constructor(readonly value: number) {}

  static create(value: number): Count {
    if (value < 0) {
      throw new Error('Count must be greater than or equal to 0');
    }
    return new Count(value);
  }

  getValue(): number {
    return this.value;
  }
}
