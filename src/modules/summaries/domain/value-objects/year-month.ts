import * as moment from 'moment-timezone';

export class YearMonth {
  private constructor(
    private readonly _year: number,
    private readonly _month: number,
  ) {}

  static create(year: number, month: number): YearMonth {
    if (month < 1 || month > 12) {
      throw new Error('Invalid month: Month must be between 1 and 12');
    }
    return new YearMonth(year, month);
  }

  get year(): number {
    return this._year;
  }

  get month(): number {
    return this._month;
  }

  getStartDate(timezone: string): moment.Moment {
    const formattedDate = `${this.year}-${String(this.month).padStart(2, '0')}-01`;
    return moment.tz(formattedDate, timezone);
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
