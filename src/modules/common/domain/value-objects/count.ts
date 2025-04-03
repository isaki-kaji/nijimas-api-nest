export class Count {
  private constructor(private readonly _value: number) {}

  static create(value: number): Count {
    if (value < 0) {
      throw new Error('Count must be greater than or equal to 0');
    }
    return new Count(value);
  }

  get value(): number {
    return this._value;
  }
}
