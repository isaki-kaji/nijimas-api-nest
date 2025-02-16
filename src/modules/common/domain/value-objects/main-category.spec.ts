import { MainCategoryEnum } from '../enums/main-category.enum';
import { MainCategory } from './main-category';

describe('MainCategory', () => {
  describe('create', () => {
    it('should create an instance with a valid category', () => {
      const category = MainCategory.create(MainCategoryEnum.FOOD);

      expect(category).toBeInstanceOf(MainCategory);
      expect(category.getValue()).toBe(MainCategoryEnum.FOOD);
    });

    it('should throw an error if value is empty', () => {
      expect(() =>
        MainCategory.create(null as unknown as MainCategoryEnum),
      ).toThrow('Main category must not be empty');
    });

    it('should throw an error if value is invalid', () => {
      expect(() =>
        MainCategory.create('INVALID_CATEGORY' as MainCategoryEnum),
      ).toThrow('Invalid main category: INVALID_CATEGORY');
    });
  });

  describe('equals', () => {
    it('should return true if categories are equal', () => {
      const category1 = MainCategory.create(MainCategoryEnum.FOOD);
      const category2 = MainCategory.create(MainCategoryEnum.FOOD);

      expect(category1.equals(category2)).toBe(true);
    });

    it('should return false if categories are different', () => {
      const category1 = MainCategory.create(MainCategoryEnum.FOOD);
      const category2 = MainCategory.create(MainCategoryEnum.ESSENTIALS);

      expect(category1.equals(category2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const category = MainCategory.create(MainCategoryEnum.FASHION);
      expect(category.getValue()).toBe(MainCategoryEnum.FASHION);
    });
  });
});
