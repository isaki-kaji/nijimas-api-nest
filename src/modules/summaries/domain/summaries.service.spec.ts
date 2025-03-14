import {
  genDailyActivitySummary,
  generateExpenseSummary,
} from 'testing/utils/summaries-test-util';
import { SummariesService } from './summaries.service';
import { ExpenseSummaryList } from './value-objects/expense-summary-list';
import { DailyActivitySummariesByMonth } from './value-objects/daily-activity-summaries-by-month';

describe('SummariesService', () => {
  let service: SummariesService;

  beforeEach(() => {
    service = new SummariesService();
  });

  describe('generateCalculatedSummaries', () => {
    it('should return empty array if summaries list is empty', () => {
      const summaries = ExpenseSummaryList.create([]);
      const result = service.generateCalculatedSummaries(summaries);
      expect(result).toEqual([]);
    });

    it('should return empty array if total amount is zero', () => {
      const summary = generateExpenseSummary('Category1', 1, 0);
      const summaries = ExpenseSummaryList.create([summary]);
      const result = service.generateCalculatedSummaries(summaries);
      expect(result).toEqual([]);
    });

    it('should return calculated summaries sorted by amount in descending order', () => {
      const summary1 = generateExpenseSummary('Category1', 2, 300);
      const summary2 = generateExpenseSummary('Category2', 1, 700);
      const summaries = ExpenseSummaryList.create([summary1, summary2]);

      const result = service.generateCalculatedSummaries(summaries);

      expect(result).toHaveLength(2);
      expect(result[0].getCategory()).toBe('Category2');
      expect(result[1].getCategory()).toBe('Category1');
    });
  });

  describe('generateDailyActivityLists', () => {
    it('should generate daily activity lists with correct counts and amounts', () => {
      const summary1 = genDailyActivitySummary(1, 2, 100);
      const summary2 = genDailyActivitySummary(2, 1, 200);
      const summaries = DailyActivitySummariesByMonth.create(
        [summary1, summary2],
        31,
      );

      const result = service.generateDailyActivityLists(summaries);

      expect(result.getCounts()[0].getValue()).toBe(2);
      expect(result.getCounts()[1].getValue()).toBe(1);
      expect(result.getAmounts()[0].getValue()).toBe(100);
      expect(result.getAmounts()[1].getValue()).toBe(200);
    });

    it('should fill missing days with zero counts and amounts', () => {
      const summary1 = genDailyActivitySummary(1, 2, 100);
      const summaries = DailyActivitySummariesByMonth.create([summary1], 31);

      const result = service.generateDailyActivityLists(summaries);

      expect(result.getCounts()[0].getValue()).toBe(2);
      expect(result.getCounts()[1].getValue()).toBe(0);
      expect(result.getAmounts()[0].getValue()).toBe(100);
      expect(result.getAmounts()[1].getValue()).toBe(0);
    });
  });
});
