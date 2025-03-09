import { CategoryNo, createCategoryNo } from './category-no';

describe('createCategoryNo', () => {
  it('should return "1" when input is 1', () => {
    const result = createCategoryNo(1);
    expect(result).toBe(CategoryNo.ONE);
  });

  it('should return "2" when input is 2', () => {
    const result = createCategoryNo(2);
    expect(result).toBe(CategoryNo.TWO);
  });

  it('should throw an error when input is invalid', () => {
    expect(() => createCategoryNo(3)).toThrow('Invalid categoryNo');
  });
});
