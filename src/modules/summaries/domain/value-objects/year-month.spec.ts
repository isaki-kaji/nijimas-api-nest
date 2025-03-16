import { YearMonth } from './year-month';

describe('YearMonth', () => {
  describe('create', () => {
    it('should create a YearMonth instance with valid year and month', () => {
      const year = 2025;
      const month = 3;
      const yearMonth = YearMonth.create(year, month);
      expect(yearMonth.getYear()).toBe(year);
      expect(yearMonth.getMonth()).toBe(month);
    });

    it('should throw an error if the month is less than 1', () => {
      expect(() => YearMonth.create(2025, 0)).toThrow(
        'Invalid month: Month must be between 1 and 12',
      );
    });

    it('should throw an error if the month is greater than 12', () => {
      expect(() => YearMonth.create(2025, 13)).toThrow(
        'Invalid month: Month must be between 1 and 12',
      );
    });
  });

  describe('getStartDate', () => {
    it('should return the correct start date for the given timezone', () => {
      const yearMonth = YearMonth.create(2025, 3);
      const timezone = 'Asia/Tokyo';
      const startDate = yearMonth.getStartDate(timezone);
      expect(startDate.format('YYYY-MM-DD')).toBe('2025-03-01');
      expect(startDate.tz()).toBe(timezone);
    });
  });

  describe('getEndDate', () => {
    it('should return the correct end date for the given timezone', () => {
      const yearMonth = YearMonth.create(2025, 3);
      const timezone = 'Asia/Tokyo';
      const endDate = yearMonth.getEndDate(timezone);
      expect(endDate.format('YYYY-MM-DD')).toBe('2025-04-01');
      expect(endDate.tz()).toBe(timezone);
    });
  });

  describe('getLastDayOfMonth', () => {
    it('should return the correct last day of the month for the given timezone', () => {
      const yearMonth = YearMonth.create(2025, 2);
      const timezone = 'Asia/Tokyo';
      const lastDay = yearMonth.getLastDayOfMonth(timezone);
      expect(lastDay.format('YYYY-MM-DD')).toBe('2025-02-28');
      expect(lastDay.tz()).toBe(timezone);
    });

    it('should account for leap years correctly', () => {
      const yearMonth = YearMonth.create(2024, 2);
      const timezone = 'Asia/Tokyo';
      const lastDay = yearMonth.getLastDayOfMonth(timezone);
      expect(lastDay.format('YYYY-MM-DD')).toBe('2024-02-29');
      expect(lastDay.tz()).toBe(timezone);
    });
  });

  describe('getDaysInMonth', () => {
    it('should return the correct number of days in the month for the given timezone', () => {
      const yearMonth = YearMonth.create(2025, 2);
      const timezone = 'Asia/Tokyo';
      const daysInMonth = yearMonth.getDaysInMonth(timezone);
      expect(daysInMonth).toBe(28);
    });

    it('should account for leap years correctly', () => {
      const yearMonth = YearMonth.create(2024, 2);
      const timezone = 'Asia/Tokyo';
      const daysInMonth = yearMonth.getDaysInMonth(timezone);
      expect(daysInMonth).toBe(29);
    });
  });

  describe('equals', () => {
    it('should return true for YearMonth instances with the same year and month', () => {
      const yearMonth1 = YearMonth.create(2025, 3);
      const yearMonth2 = YearMonth.create(2025, 3);
      expect(yearMonth1.equals(yearMonth2)).toBe(true);
    });

    it('should return false for YearMonth instances with different years or months', () => {
      const yearMonth1 = YearMonth.create(2025, 3);
      const yearMonth2 = YearMonth.create(2025, 4);
      const yearMonth3 = YearMonth.create(2026, 3);
      expect(yearMonth1.equals(yearMonth2)).toBe(false);
      expect(yearMonth1.equals(yearMonth3)).toBe(false);
    });
  });
});
