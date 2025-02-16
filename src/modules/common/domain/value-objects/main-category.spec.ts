import { MainCategoryEnum } from '../enums/main-category.enum';
import { MainCategory } from './main-category';

describe('MainCategory', () => {
  describe('create', () => {
    it('should create an instance with a valid category', () => {
      const category = MainCategory.create('food');

      expect(category).toBeInstanceOf(MainCategory);
      expect(category.getValue()).toBe(MainCategoryEnum.FOOD);
    });

    it('should throw an error if value is empty', () => {
      expect(() =>
        MainCategory.create(null as unknown as MainCategoryEnum),
      ).toThrow('Main category must not be empty');
    });

    it('should throw an error if value is invalid', () => {
      expect(() => MainCategory.create('book')).toThrow(
        'Invalid main category',
      );
    });
  });

  describe('equals', () => {
    it('should return true if categories are equal', () => {
      const category1 = MainCategory.create('food');
      const category2 = MainCategory.create('food');

      expect(category1.equals(category2)).toBe(true);
    });

    it('should return false if categories are different', () => {
      const category1 = MainCategory.create('food');
      const category2 = MainCategory.create('fashion');

      expect(category1.equals(category2)).toBe(false);
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const category = MainCategory.create('fashion');
      expect(category.getValue()).toBe(MainCategoryEnum.FASHION);
    });
  });
});
