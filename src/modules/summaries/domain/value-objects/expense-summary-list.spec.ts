import { ExpenseSummaryList } from './expense-summary-list';
import { ExpenseSummary } from './expense-summary';
import { mock } from 'jest-mock-extended';
import { Expense } from 'modules/common/domain/value-objects/expense';

describe('ExpenseSummaryList', () => {
  describe('create', () => {
    it('should create an instance with unique categories', () => {
      const expenseSummary1 = {
        get category() {
          return 'Category1';
        },
      } as ExpenseSummary<any>;
      const expenseSummary2 = {
        get category() {
          return 'Category2';
        },
      } as ExpenseSummary<any>;

      const list = ExpenseSummaryList.create([
        expenseSummary1,
        expenseSummary2,
      ]);

      expect(list).toBeInstanceOf(ExpenseSummaryList);
    });

    it('should throw an error if categories are not unique', () => {
      const expenseSummary1 = {
        get category() {
          return 'Category1';
        },
      } as ExpenseSummary<any>;
      const expenseSummary2 = {
        get category() {
          return 'Category1';
        },
      } as ExpenseSummary<any>;

      expect(() => {
        ExpenseSummaryList.create([expenseSummary1, expenseSummary2]);
      }).toThrow('Categories must be unique');
    });
  });

  describe('getSummaries', () => {
    it('should return a copy of the summaries array', () => {
      const expenseSummary1 = {
        get category() {
          return 'Category1';
        },
      } as ExpenseSummary<any>;
      const expenseSummary2 = {
        get category() {
          return 'Category2';
        },
      } as ExpenseSummary<any>;

      const list = ExpenseSummaryList.create([
        expenseSummary1,
        expenseSummary2,
      ]);
      const summaries = list.summaries;

      expect(summaries).toEqual([expenseSummary1, expenseSummary2]);
      expect(summaries).not.toBe(list.summaries); // 配列のコピーであることを確認
    });
  });

  describe('getTotalAmount', () => {
    it('should return the total amount of all summaries', () => {
      const expenseSummary1 = {
        get category() {
          return 'Category1';
        },
        get amount() {
          return Expense.create(100);
        },
      } as ExpenseSummary<any>;
      const expenseSummary2 = {
        get category() {
          return 'Category2';
        },
        get amount() {
          return Expense.create(200);
        },
      } as ExpenseSummary<any>;
      const expenseSummary3 = {
        get category() {
          return 'Category3';
        },
        get amount() {
          return Expense.create(300);
        },
      } as ExpenseSummary<any>;

      const list = ExpenseSummaryList.create([
        expenseSummary1,
        expenseSummary2,
        expenseSummary3,
      ]);
      const totalAmount = list.totalAmount;

      expect(totalAmount.value).toBe(600);
    });
  });
});
