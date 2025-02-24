export class CategoryNo {
  private constructor(public readonly value: string) {}

  public static create(value: string): CategoryNo {
    if (!value) {
      throw new Error('Category no must not be empty');
    }
    return new CategoryNo(value);
  }

  public getValue(): string {
    return this.value;
  }
}
