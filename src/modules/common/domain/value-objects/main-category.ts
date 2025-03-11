import { MainCategoryEnum } from '../enums/main-category.enum';

export class MainCategory {
  private constructor(public readonly value: MainCategoryEnum) {}

  public static create(value?: string): MainCategory {
    if (!value) {
      throw new Error('Main category must not be empty');
    }

    const enumValue = value as MainCategoryEnum;
    if (!this.isValid(enumValue)) {
      throw new Error('Invalid main category');
    }

    return new MainCategory(enumValue);
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
