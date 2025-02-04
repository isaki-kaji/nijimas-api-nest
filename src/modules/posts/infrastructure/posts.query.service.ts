import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IPostsQueryService } from '../application/i.posts.query.service';
import { PostResponseDto } from '../application/dto/response/post.response.dto';

@Injectable()
export class PostsQueryService implements IPostsQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async findOne(uid: string, postId: string): Promise<PostResponseDto | null> {
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
      p.public_type_no,
      p.created_at
    FROM posts p
    JOIN users u ON p.uid = u.uid
    LEFT JOIN (
      SELECT
        ps.post_id,
        MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1,
        MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
      FROM post_subcategories ps
      JOIN sub_categories s ON ps.category_id = s.category_id
      GROUP BY ps.post_id
    ) sc ON p.post_id = sc.post_id
    LEFT JOIN favorites f
      ON p.post_id = f.post_id AND f.uid = $1
    WHERE 
      p.post_id = $2 AND (
        p.public_type_no = '0' OR
        (p.public_type_no = '1' AND EXISTS (
          SELECT 1
          FROM follows
          WHERE uid = $1 AND following_uid = p.uid
        )) OR
        (p.public_type_no IN ('1', '2') AND p.uid = $1)
      )
    LIMIT 1;
  `;

    const rawPosts = await this.dataSource.query(sql, [uid, postId]);

    if (rawPosts.length === 0) {
      return null;
    }

    return this.toResponseDto(rawPosts[0]);
  }

  async findOwnPosts(uid: string): Promise<PostResponseDto[]> {
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
    const rawPosts = await this.dataSource.query(sql, [uid]);

    return rawPosts.map((raw) => this.toResponseDto(raw));
  }

  async findTimelinePosts(uid: string): Promise<PostResponseDto[]> {
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
    const rawPosts = await this.dataSource.query(sql, [uid]);

    return rawPosts.map((raw) => this.toResponseDto(raw));
  }

  async findPostsByUid(
    uid: string,
    targetUid: string,
  ): Promise<PostResponseDto[]> {
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
      p.public_type_no,
      p.created_at
    FROM posts p
    JOIN users u ON p.uid = u.uid
    LEFT JOIN (
      SELECT
        ps.post_id,
        MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1,
        MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
      FROM post_subcategories ps
      JOIN sub_categories s ON ps.category_id = s.category_id
      GROUP BY ps.post_id
    ) sc ON p.post_id = sc.post_id
    LEFT JOIN favorites f
    ON p.post_id = f.post_id AND f.uid = $1
    WHERE 
    p.uid = $2 
    AND (
      p.public_type_no = '0'
      OR (
        p.public_type_no = '1'
        AND EXISTS (
          SELECT 1
          FROM follows
          WHERE uid = $1 AND following_uid = $2
        )
      )
    )
    ORDER BY p.post_id DESC
    LIMIT 50;
    `;

    const rawPosts = await this.dataSource.query(sql, [uid, targetUid]);

    return rawPosts.map((raw) => this.toResponseDto(raw));
  }

  async findPostsBySubCategory(
    uid: string,
    categoryName: string,
  ): Promise<PostResponseDto[]> {
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

    const rawPosts = await this.dataSource.query(sql, [uid, categoryName]);

    return rawPosts.map((raw) => this.toResponseDto(raw));
  }

  private toResponseDto(raw: any): PostResponseDto {
    return {
      postId: raw.post_id,
      uid: raw.uid,
      username: raw.username,
      profileImageUrl: raw.profile_image_url,
      mainCategory: raw.main_category,
      subCategory1: raw.sub_category1 || null,
      subCategory2: raw.sub_category2 || null,
      postText: raw.post_text || null,
      photoUrlList: raw.photo_url ? raw.photo_url.split(',') : [],
      expense: raw.expense || null,
      location: raw.location || null,
      isFavorite: raw.is_favorite,
      publicTypeNo: raw.public_type_no,
      createdAt: new Date(raw.created_at),
    };
  }
}
