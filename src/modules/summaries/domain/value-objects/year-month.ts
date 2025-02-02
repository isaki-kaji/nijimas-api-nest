import * as moment from 'moment-timezone';

export class YearMonth {
  private constructor(
    private readonly year: number,
    private readonly month: number,
  ) {}

  static create(year: number, month: number): YearMonth {
    if (month < 1 || month > 12) {
      throw new Error('Invalid month: Month must be between 1 and 12');
    }
    return new YearMonth(year, month);
  }

  getYear(): number {
    return this.year;
  }

  getMonth(): number {
    return this.month;
  }

  getStartDate(timezone: string): moment.Moment {
    return moment.tz(`${this.year}-${this.month}-01`, timezone);
  }

  getEndDate(timezone: string): moment.Moment {
    return this.getStartDate(timezone).clone().add(1, 'month');
  }

  getLastDayOfMonth(timezone: string): moment.Moment {
    return this.getEndDate(timezone).clone().subtract(1, 'day');
  }

  getDaysInMonth(timezone: string): number {
    return this.getLastDayOfMonth(timezone).date();
  }

  equals(other: YearMonth): boolean {
    return this.year === other.year && this.month === other.month;
  }
}
