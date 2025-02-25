import { Injectable } from '@nestjs/common';
import { ISummariesRepository } from '../domain/i.summaries.repository';
import { DataSource } from 'typeorm';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { MainCategorySummary } from '../domain/value-objects/maincategory-summary';
import { Count } from 'modules/common/domain/value-objects/count';
import { Expense } from 'modules/common/domain/value-objects/expense';
import { SubCategorySummary } from '../domain/value-objects/subcategoroy-summary';
import { DailyActivitySummary } from '../domain/value-objects/daily-activity-summary';

@Injectable()
export class SummariesRepository implements ISummariesRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getMainCategorySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<MainCategorySummary[]> {
    const query = `
      SELECT
        main_category,
        COUNT(*) AS count,
        SUM(expense) AS amount
      FROM posts
      WHERE uid = $1
        AND deleted_at IS NULL
        AND timezone('Asia/Tokyo', created_at) >= $2
        AND timezone('Asia/Tokyo', created_at) < $3
      GROUP BY main_category;
    `;

    const result = await this.dataSource.query(query, [
      uid.getValue(),
      startDate,
      endDate,
    ]);

    return result.map((row) =>
      MainCategorySummary.create(
        row.main_category,
        Count.create(Number(row.count)),
        Expense.create(Number(row.amount)),
      ),
    );
  }

  async getSubCategorySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<SubCategorySummary[]> {
    const query = `
      SELECT
        s.category_name,
        COUNT(*) AS count,
        SUM(p.expense) AS amount
      FROM posts p
      JOIN post_subcategories ps ON p.post_id = ps.post_id
      JOIN sub_categories s ON ps.category_id = s.category_id
      WHERE p.uid = $1
        AND deleted_at IS NULL
        AND timezone('Asia/Tokyo', p.created_at) >= $2
        AND timezone('Asia/Tokyo', p.created_at) < $3
      GROUP BY s.category_name;
    `;

    const result = await this.dataSource.query(query, [
      uid.getValue(),
      startDate,
      endDate,
    ]);

    return result.map((row) =>
      SubCategorySummary.create(
        row.category_name,
        Count.create(Number(row.count)),
        Expense.create(Number(row.amount)),
      ),
    );
  }

  async GetDailyActivitySummaryByMonth(
    uid: Uid,
    startDate: Date,
    endDate: Date,
  ): Promise<DailyActivitySummary[]> {
    const query = `
      SELECT
        DATE_PART('day', timezone('Asia/Tokyo', created_at))::int AS date,
        COUNT(*) AS count,
        SUM(expense) AS amount
      FROM posts
      WHERE uid = $1
        AND deleted_at IS NULL
        AND timezone('Asia/Tokyo', created_at) >= $2
        AND timezone('Asia/Tokyo', created_at) < $3
      GROUP BY DATE_PART('day', timezone('Asia/Tokyo', created_at))
      ORDER BY date;
    `;

    const result = await this.dataSource.query(query, [
      uid.getValue(),
      startDate,
      endDate,
    ]);

    return result.map((row) =>
      DailyActivitySummary.create(
        Number(row.date),
        Count.create(Number(row.count)),
        Expense.create(Number(row.amount)),
      ),
    );
  }
}
