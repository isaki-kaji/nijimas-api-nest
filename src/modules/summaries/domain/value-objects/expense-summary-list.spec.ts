import { ExpenseSummaryList } from './expense-summary-list';
import { ExpenseSummary } from './expense-summary';
import { mock } from 'jest-mock-extended';
import { Expense } from 'modules/common/domain/value-objects/expense';

describe('ExpenseSummaryList', () => {
  const expenseSummary1 = mock<ExpenseSummary<any>>();
  const expenseSummary2 = mock<ExpenseSummary<any>>();
  const expenseSummary3 = mock<ExpenseSummary<any>>();

  describe('create', () => {
    it('should create an instance with unique categories', () => {
      expenseSummary1.getCategory.mockReturnValue('Category1');
      expenseSummary2.getCategory.mockReturnValue('Category2');

      const list = ExpenseSummaryList.create([
        expenseSummary1,
        expenseSummary2,
      ]);

      expect(list).toBeInstanceOf(ExpenseSummaryList);
    });

    it('should throw an error if categories are not unique', () => {
      expenseSummary1.getCategory.mockReturnValue('Category1');
      expenseSummary2.getCategory.mockReturnValue('Category1');

      expect(() => {
        ExpenseSummaryList.create([expenseSummary1, expenseSummary2]);
      }).toThrow('Categories must be unique');
    });
  });

  describe('getSummaries', () => {
    it('should return a copy of the summaries array', () => {
      expenseSummary1.getCategory.mockReturnValue('Category1');
      expenseSummary2.getCategory.mockReturnValue('Category2');

      const list = ExpenseSummaryList.create([
        expenseSummary1,
        expenseSummary2,
      ]);
      const summaries = list.getSummaries();

      expect(summaries).toEqual([expenseSummary1, expenseSummary2]);
      expect(summaries).not.toBe(list.getSummaries());
    });
  });

  describe('getTotalAmount', () => {
    it('should return the total amount of all summaries', () => {
      expenseSummary1.getAmount.mockReturnValue(Expense.create(100));
      expenseSummary2.getAmount.mockReturnValue(Expense.create(200));
      expenseSummary3.getAmount.mockReturnValue(Expense.create(300));

      const list = ExpenseSummaryList.create([
        expenseSummary1,
        expenseSummary2,
        expenseSummary3,
      ]);
      const totalAmount = list.getTotalAmount();

      expect(totalAmount.getValue()).toBe(600);
    });
  });
});
