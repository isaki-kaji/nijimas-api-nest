import { Expense } from './expense';

describe('Expense', () => {
  describe('create', () => {
    it('should create an Expense instance with a valid value', () => {
      const expense = Expense.create(5000);
      expect(expense.getValue()).toBe(5000);
    });

    it('should throw an error if the value is negative', () => {
      expect(() => Expense.create(-1)).toThrow(
        'Expense must be a positive number.',
      );
    });

    it('should throw an error if the value exceeds 100,000,000', () => {
      expect(() => Expense.create(100000001)).toThrow(
        'Expense must be less than 100,000,000.',
      );
    });
  });

  describe('isZero', () => {
    it('should return true if the value is 0', () => {
      const expense = Expense.create(0);
      expect(expense.isZero()).toBe(true);
    });

    it('should return false if the value is greater than 0', () => {
      const expense = Expense.create(500);
      expect(expense.isZero()).toBe(false);
    });
  });

  describe('isOverOneBillion', () => {
    it('should return true if the value is 100,000,000', () => {
      const expense = Expense.create(100000000);
      expect(expense.isOverOneBillion()).toBe(true);
    });

    it('should return false if the value is less than 100,000,000', () => {
      const expense = Expense.create(99999999);
      expect(expense.isOverOneBillion()).toBe(false);
    });
  });

  describe('add', () => {
    it('should return a new Expense with the sum of two expenses', () => {
      const expense1 = Expense.create(3000);
      const expense2 = Expense.create(2000);
      const result = expense1.add(expense2);

      expect(result.getValue()).toBe(5000);
    });

    it('should throw an error if the sum exceeds 100,000,000', () => {
      const expense1 = Expense.create(90000000);
      const expense2 = Expense.create(20000000);

      expect(() => expense1.add(expense2)).toThrow(
        'Expense must be less than 100,000,000.',
      );
    });
  });

  describe('outputPercentage', () => {
    it('should return 0 if the expense value is 0', () => {
      const expense = Expense.create(0);
      const total = Expense.create(10000);
      expect(expense.outputPercentage(total)).toBe(0);
    });

    it('should return 0 if the total value is 0', () => {
      const expense = Expense.create(5000);
      const total = Expense.create(0);
      expect(expense.outputPercentage(total)).toBe(0);
    });

    it('should return the correct percentage', () => {
      const expense = Expense.create(3000);
      const total = Expense.create(10000);
      expect(expense.outputPercentage(total)).toBe(30);
    });

    it('should return 100 if total and expense are the same', () => {
      const expense = Expense.create(10000);
      const total = Expense.create(10000);
      expect(expense.outputPercentage(total)).toBe(100);
    });

    it('should return a rounded percentage value', () => {
      const expense = Expense.create(3333);
      const total = Expense.create(10000);
      expect(expense.outputPercentage(total)).toBe(33.33);
    });
  });
});
