import { DailyActivitySummariesByMonth } from './daily-activity-summaries-by-month';
import { genDailyActivitySummary } from 'testing/utils/summaries-test-util';

describe('DailyActivitySummariesByMonth', () => {
  const summary1 = genDailyActivitySummary(1, 10, 100);
  const summary2 = genDailyActivitySummary(15, 20, 200);
  const summary3 = genDailyActivitySummary(30, 30, 300);
  const summaries = [summary1, summary2, summary3];
  const daysInMonth = 30;

  describe('create', () => {
    it('should create an instance with valid summaries and daysInMonth', () => {
      const instance = DailyActivitySummariesByMonth.create(
        summaries,
        daysInMonth,
      );
      expect(instance).toBeInstanceOf(DailyActivitySummariesByMonth);
      expect(instance.summaries).toHaveLength(3);
      expect(instance.daysInMonth).toBe(daysInMonth);
    });

    it('should throw an error if daysInMonth is less than 28 or greater than 31', () => {
      expect(() => DailyActivitySummariesByMonth.create(summaries, 27)).toThrow(
        'Invalid number of days in month',
      );
      expect(() => DailyActivitySummariesByMonth.create(summaries, 32)).toThrow(
        'Invalid number of days in month',
      );
    });
  });

  describe('validateSummaries', () => {
    it('should throw an error if any summary has an invalid date', () => {
      const invalidSummary = genDailyActivitySummary(32, 10, 100);
      expect(() =>
        DailyActivitySummariesByMonth.create(
          [...summaries, invalidSummary],
          daysInMonth,
        ),
      ).toThrow('Invalid daily activity summary');
    });

    it('should not throw an error if all summaries have valid dates', () => {
      expect(() =>
        DailyActivitySummariesByMonth.create(summaries, daysInMonth),
      ).not.toThrow();
    });
  });
});
