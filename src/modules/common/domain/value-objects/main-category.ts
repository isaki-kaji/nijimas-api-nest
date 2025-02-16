import { MainCategoryEnum } from '../enums/main-category.enum';

export class MainCategory {
  private constructor(public readonly value: MainCategoryEnum) {}

  public static create(value: MainCategoryEnum): MainCategory {
    if (!value) {
      throw new Error('Main category must not be empty');
    }

    if (!this.isValid(value)) {
      throw new Error(`Invalid main category: ${value}`);
    }

    return new MainCategory(value);
  }

  private static isValid(value: MainCategoryEnum): boolean {
    return Object.values(MainCategoryEnum).includes(value);
  }

  public equals(other: MainCategory): boolean {
    return this.value === other.value;
  }

  public getValue(): MainCategoryEnum {
    return this.value;
  }
}
