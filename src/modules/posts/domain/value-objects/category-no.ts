import { CategoryNoEnum } from '../enums/category-no.enum';

export class CategoryNo {
  private constructor(public readonly value: CategoryNoEnum) {}

  public static create(value: string): CategoryNo {
    if (!value) {
      throw new Error('Category no must not be empty');
    }

    if (!this.isValid(value)) {
      throw new Error(`Invalid category no: ${value}`);
    }

    return new CategoryNo(value as CategoryNoEnum);
  }

  private static isValid(value: string): boolean {
    return Object.values(CategoryNoEnum).includes(value as CategoryNoEnum);
  }

  public getValue(): string {
    return this.value;
  }
}
