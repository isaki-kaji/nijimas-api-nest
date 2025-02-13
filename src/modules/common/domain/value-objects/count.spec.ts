import { Count } from './count';

describe('Count', () => {
  describe('create', () => {
    it('should create an instance with a valid value', () => {
      const count = Count.create(10);
      expect(count).toBeInstanceOf(Count);
      expect(count.getValue()).toBe(10);
    });

    it('should allow creation with value 0', () => {
      const count = Count.create(0);
      expect(count.getValue()).toBe(0);
    });

    it('should throw an error if value is negative', () => {
      expect(() => Count.create(-1)).toThrow(Error);
      expect(() => Count.create(-1)).toThrow('Count must be greater than or equal to 0');
    });
  });

  describe('getValue', () => {
    it('should return the correct value', () => {
      const count = Count.create(5);
      expect(count.getValue()).toBe(5);
    });
  });
});
