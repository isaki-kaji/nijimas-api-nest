export class FavoriteCategoryNo {
  private constructor(readonly value: string) {}

  static readonly VALID_VALUES = ['1', '2', '3', '4'];

  static create(value: string): FavoriteCategoryNo {
    if (!this.VALID_VALUES.includes(value)) {
      throw new Error(
        `FavoriteCategoryNo must be one of the following: ${this.VALID_VALUES.join(', ')}`,
      );
    }
    return new FavoriteCategoryNo(value);
  }

  getValue(): string {
    return this.value;
  }
}
