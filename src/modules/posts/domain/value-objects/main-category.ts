export class MainCategory {
  private constructor(public readonly value: MainCategoryEnum) {}

  public static create(value: string): MainCategory {
    if (!value) {
      throw new Error('Main category must not be empty');
    }

    if (!this.isValid(value)) {
      throw new Error(`Invalid main category: ${value}`);
    }

    return new MainCategory(value as MainCategoryEnum);
  }

  private static isValid(value: string): boolean {
    return Object.values(MainCategoryEnum).includes(value as MainCategoryEnum);
  }

  public equals(other: MainCategory): boolean {
    return this.value === other.value;
  }

  public getValue(): string {
    return this.value;
  }
}
