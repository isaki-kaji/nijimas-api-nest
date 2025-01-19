import { Injectable } from '@nestjs/common';
import { Uid } from 'modules/common/domain/value-objects/uid';
import { DataSource } from 'typeorm';
import { Post } from '../domain/models/post';
import { UUID } from 'modules/common/domain/value-objects/uuid';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { MainCategory } from '../domain/value-objects/main-category';
import { PublicTypeNo } from '../domain/value-objects/public-type-no';
import { PhotoUrlList } from '../domain/value-objects/photo-url-list';
import { Expense } from '../domain/value-objects/expense';

@Injectable()
export class PostsSearchRepository {
  constructor(private readonly dataSource: DataSource) {}

  async findOwnPosts(uid: Uid): Promise<Post[]> {
    const sql = `
      SELECT 
        "p"."post_id",
        "u"."uid",
        "u"."username",
        "u"."profile_image_url",
        "p"."main_category",
        COALESCE(sc.sub_category1, '') AS sub_category1, 
        COALESCE(sc.sub_category2, '') AS sub_category2, 
        "p"."post_text", 
        "p"."photo_url",
        "p"."expense",
        "p"."location",
        CASE WHEN f.uid IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite, 
        "p"."public_type_no" AS public_type_no, 
        "p"."created_at" AS created_at
      FROM 
        "posts" "p"
      INNER JOIN 
        "users" "u" ON "p"."uid" = "u"."uid"
      LEFT JOIN (
        SELECT 
          "ps"."post_id" AS postId, 
          MAX(CASE WHEN "ps"."category_no" = '1' THEN "s"."category_name" ELSE NULL END) AS sub_category1, 
          MAX(CASE WHEN "ps"."category_no" = '2' THEN "s"."category_name" ELSE NULL END) AS sub_category2
        FROM 
          "post_subcategories" "ps"
        INNER JOIN 
          "sub_categories" "s" ON "ps"."category_id" = "s"."category_id"
        GROUP BY 
          "ps"."post_id"
      ) "sc" ON "p"."post_id" = sc.postId
      LEFT JOIN 
        "favorites" "f" ON "p"."post_id" = f.post_id AND f.uid = $1
      WHERE 
        "p"."uid" = $1
      ORDER BY 
        "p"."post_id" DESC
      LIMIT 50;
    `;
    const rawPosts = await this.dataSource.query(sql, [uid.value]);

    return rawPosts.map((raw) => this.toModel(raw));
  }

  async findTimelinePosts(uid: Uid): Promise<Post[]> {
    const sql = `
      SELECT
        "p"."post_id",
        "u"."uid",
        "u"."username",
        "u"."profile_image_url",
        "p"."main_category",
        COALESCE(sc.sub_category1, '') AS sub_category1,
        COALESCE(sc.sub_category2, '') AS sub_category2,
        "p"."post_text",
        "p"."photo_url",
        "p"."expense",
        "p"."location",
        CASE WHEN f.uid IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite,
        "p"."public_type_no",
        "p"."created_at"
      FROM 
        "posts" "p"
      JOIN 
        "users" "u" ON "p"."uid" = "u"."uid"
      LEFT JOIN (
        SELECT
          "ps"."post_id",
          MAX(CASE WHEN "ps"."category_no" = '1' THEN "s"."category_name" ELSE NULL END) AS sub_category1,
          MAX(CASE WHEN "ps"."category_no" = '2' THEN "s"."category_name" ELSE NULL END) AS sub_category2
        FROM 
          "post_subcategories" "ps"
        JOIN 
          "sub_categories" "s" ON "ps"."category_id" = "s"."category_id"
        GROUP BY 
          "ps"."post_id"
      ) "sc" ON "p"."post_id" = sc.post_id
      LEFT JOIN 
        "favorites" "f" ON "p"."post_id" = f.post_id AND f.uid = $1
      WHERE 
        "p"."uid" = $1
        OR (
          "p"."public_type_no" IN ('0', '1') 
          AND EXISTS (
            SELECT 1 
            FROM "follows" "f"
            WHERE "f"."uid" = $1 AND "f"."following_uid" = "p"."uid"
          )
        )
      ORDER BY 
        "p"."post_id" DESC
      LIMIT 50;
    `;
    const rawPosts = await this.dataSource.query(sql, [uid.value]);

    return rawPosts.map((raw) => this.toModel(raw));
  }

  async findPostsBySubCategory(
    uid: Uid,
    categoryName: string,
  ): Promise<Post[]> {
    const sql = `
      SELECT
        p.post_id,
        u.uid,
        u.username,
        u.profile_image_url,
        p.main_category,
        COALESCE(sc.sub_category1, '')::text AS sub_category1,
        COALESCE(sc.sub_category2, '')::text AS sub_category2,
        p.post_text,
        p.photo_url,
        p.expense,
        p.location,
        CASE WHEN f.uid IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite,
        "p"."public_type_no",
        p.created_at
      FROM posts p
      JOIN users u ON p.uid = u.uid
      JOIN (
        SELECT
          ps.post_id,
          MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1,
          MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
        FROM post_subcategories ps
        JOIN sub_categories s ON ps.category_id = s.category_id
        GROUP BY ps.post_id
        HAVING 
          MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) = $2 OR 
          MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) = $2
      ) sc ON p.post_id = sc.post_id
      LEFT JOIN favorites f
        ON p.post_id = f.post_id AND f.uid = $1
      WHERE p.public_type_no = '0'
          OR (
            p.public_type_no = '1'
            AND EXISTS (
              SELECT 1 
              FROM follows 
              WHERE uid = $1 AND following_uid = p.uid
            )
          )
          OR (
            p.public_type_no IN ('1', '2')
            AND p.uid = $1
          )
      ORDER BY p.post_id DESC
      LIMIT 50;
    `;

    const rawPosts = await this.dataSource.query(sql, [
      uid.value,
      categoryName,
    ]);

    return rawPosts.map((raw) => this.toModel(raw));
  }

  private toModel(raw: any): Post {
    return new Post(
      UUID.create(raw.post_id),
      Uid.create(raw.uid),
      raw.username,
      raw.profile_image_url ? ImageUrl.create(raw.profile_image_url) : null,
      MainCategory.create(raw.main_category),
      raw.is_favorite,
      PublicTypeNo.create(raw.public_type_no),
      new Date(raw.created_at),
      raw.sub_category1 || null,
      raw.sub_category2 || null,
      raw.post_text || null,
      raw.photo_url ? PhotoUrlList.create(raw.photo_url) : null,
      raw.expense ? Expense.create(raw.expense) : null,
      raw.location || undefined,
    );
  }
}
