import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { IPostsQueryService } from '../application/i.posts.query.service';
import { PostResponseDto } from '../application/dto/response/post.response.dto';

@Injectable()
export class PostsQueryService implements IPostsQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async findOne(
    uid: string,
    postId: string,
  ): Promise<PostResponseDto | undefined> {
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
      p.deleted_at IS NULL AND
      p.post_id = $2 AND (
        p.public_type_no = '0' OR
        (p.public_type_no = '1' AND EXISTS (
          SELECT 1
          FROM follows
          WHERE uid = $1 AND following_uid = p.uid
        )) OR
        (p.public_type_no IN ('1', '2') AND p.uid = $1)
      )
      -- ブロック関係にあるユーザーの投稿を除外
      AND NOT EXISTS (
        SELECT 1 
        FROM user_blocks ub1
        WHERE ub1.blocker_uid = $1 AND ub1.blocked_uid = p.uid
      )
      AND NOT EXISTS (
        SELECT 1 
        FROM user_blocks ub2
        WHERE ub2.blocker_uid = p.uid AND ub2.blocked_uid = $1
      )
    LIMIT 1;
  `;

    const rawPosts = await this.dataSource.query(sql, [uid, postId]);

    if (rawPosts.length === 0) {
      return undefined;
    }

    return this.toResponseDto(rawPosts[0]);
  }

  async findOwnPosts(
    uid: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]> {
    const sql = `
    SELECT 
      p.post_id,
      u.uid,
      u.username,
      u.profile_image_url,
      p.main_category,
      COALESCE(sc.sub_category1, '') AS sub_category1, 
      COALESCE(sc.sub_category2, '') AS sub_category2, 
      p.post_text, 
      p.photo_url,
      p.expense,
      p.location,
      CASE WHEN f.uid IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite,
      COUNT(f2.uid) AS favorite_count,
      p.public_type_no, 
      p.created_at,
      p.version
    FROM 
      posts p
    INNER JOIN 
      users u ON p.uid = u.uid
    LEFT JOIN (
      SELECT 
        ps.post_id AS postId, 
        MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1, 
        MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
      FROM 
        post_subcategories ps
      INNER JOIN 
        sub_categories s ON ps.category_id = s.category_id
      GROUP BY 
        ps.post_id
    ) sc ON p.post_id = sc.postId
    LEFT JOIN 
      favorites f ON p.post_id = f.post_id AND f.uid = $1
    LEFT JOIN favorites f2 ON p.post_id = f2.post_id
    WHERE 
      p.deleted_at IS NULL
      AND p.uid = $1
      ${referencePostId ? `AND p.post_id < $2` : ''} 
    GROUP BY 
      p.post_id, u.uid, sc.sub_category1, sc.sub_category2, f.uid
    ORDER BY 
      p.post_id DESC
    LIMIT 50;
  `;

    const params = referencePostId ? [uid, referencePostId] : [uid];

    const rawPosts = await this.dataSource.query(sql, params);

    return rawPosts.map((raw: any) => this.toResponseDto(raw));
  }

  async findTimelinePosts(
    uid: string,
    referencePostId?: string,
  ): Promise<PostResponseDto[]> {
    const sql = `
    SELECT
      p.post_id,
      u.uid,
      u.username,
      u.profile_image_url,
      p.main_category,
      COALESCE(sc.sub_category1, '') AS sub_category1,
      COALESCE(sc.sub_category2, '') AS sub_category2,
      p.post_text,
      p.photo_url,
      p.expense,
      p.location,
      CASE WHEN f.uid IS NOT NULL THEN TRUE ELSE FALSE END AS is_favorite,
      COUNT(f2.uid) AS favorite_count, -- 追加: favorite_count
      p.public_type_no,
      p.created_at
    FROM 
      posts p
    JOIN 
      users u ON p.uid = u.uid
    LEFT JOIN (
      SELECT
        ps.post_id,
        MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1,
        MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
      FROM 
        post_subcategories ps
      JOIN 
        sub_categories s ON ps.category_id = s.category_id
      GROUP BY 
        ps.post_id
    ) sc ON p.post_id = sc.post_id
    LEFT JOIN favorites f ON p.post_id = f.post_id AND f.uid = $1
    LEFT JOIN favorites f2 ON p.post_id = f2.post_id -- 追加: favorite_count を計算するための結合
    WHERE 
      p.deleted_at IS NULL
    AND (
      p.uid = $1
      OR (
          p.public_type_no IN ('0', '1') 
          AND EXISTS (
              SELECT 1 
              FROM follows f
              WHERE f.uid = $1 AND f.following_uid = p.uid
          )
      )
    )
    -- ブロック関係にあるユーザーの投稿を除外
    AND NOT EXISTS (
      SELECT 1 
      FROM user_blocks ub1
      WHERE ub1.blocker_uid = $1 AND ub1.blocked_uid = p.uid
    )
    AND NOT EXISTS (
      SELECT 1 
      FROM user_blocks ub2
      WHERE ub2.blocker_uid = p.uid AND ub2.blocked_uid = $1
    )
    ${referencePostId ? `AND p.post_id < $2` : ''} 
    GROUP BY p.post_id, u.uid, sc.sub_category1, sc.sub_category2, f.uid -- GROUP BY を追加
    ORDER BY 
      p.post_id DESC
    LIMIT 50;
  `;

    const params = referencePostId ? [uid, referencePostId] : [uid];
    const rawPosts = await this.dataSource.query(sql, params);

    return rawPosts.map((raw: any) => this.toResponseDto(raw));
  }

  async findPostsByUid(
    uid: string,
    targetUid: string,
    referencePostId?: string,
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
      COUNT(f2.uid) AS favorite_count, -- 追加: favorite_count
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
    LEFT JOIN favorites f ON p.post_id = f.post_id AND f.uid = $1
    LEFT JOIN favorites f2 ON p.post_id = f2.post_id -- 追加: favorite_count を計算するための結合
    WHERE
      p.deleted_at IS NULL
    AND
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
    ${referencePostId ? `AND p.post_id < $3` : ''}
    GROUP BY p.post_id, u.uid, sc.sub_category1, sc.sub_category2, f.uid -- GROUP BY を追加
    ORDER BY p.post_id DESC
    LIMIT 50;
  `;

    const params = referencePostId
      ? [uid, targetUid, referencePostId]
      : [uid, targetUid];
    const rawPosts = await this.dataSource.query(sql, params);

    return rawPosts.map((raw: any) => this.toResponseDto(raw));
  }

  async findFavoritePosts(
    uid: string,
    referencePostId?: string,
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
        COUNT(f2.uid) AS favorite_count, -- 追加: favorite_count
        p.public_type_no,
        p.created_at
      FROM posts p
      JOIN users u ON p.uid = u.uid
      JOIN favorites f ON p.post_id = f.post_id
      LEFT JOIN (
        SELECT
          ps.post_id,
          MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) AS sub_category1,
          MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) AS sub_category2
        FROM post_subcategories ps
        JOIN sub_categories s ON ps.category_id = s.category_id
        GROUP BY ps.post_id
      ) sc ON p.post_id = sc.post_id
      LEFT JOIN favorites f2 ON p.post_id = f2.post_id
      WHERE
        p.deleted_at IS NULL
      AND
        f.uid = $1
      AND (
        p.public_type_no = '0'
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
      )
      -- ブロック関係にあるユーザーの投稿を除外
      AND NOT EXISTS (
        SELECT 1 
        FROM user_blocks ub1
        WHERE ub1.blocker_uid = $1 AND ub1.blocked_uid = p.uid
      )
      AND NOT EXISTS (
        SELECT 1 
        FROM user_blocks ub2
        WHERE ub2.blocker_uid = p.uid AND ub2.blocked_uid = $1
      )
      ${referencePostId ? `AND p.post_id < $2` : ''}
      GROUP BY p.post_id, u.uid, sc.sub_category1, sc.sub_category2, f.uid
      ORDER BY p.post_id DESC
      LIMIT 50;
    `;

    const params = referencePostId ? [uid, referencePostId] : [uid];
    const rawPosts = await this.dataSource.query(sql, params);

    return rawPosts.map((raw: any) => this.toResponseDto(raw));
  }

  async findPostsBySubCategory(
    uid: string,
    categoryName: string,
    referencePostId?: string,
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
        COUNT(f2.uid) AS favorite_count,
        p.public_type_no,
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
          MAX(CASE WHEN ps.category_no = '1' THEN s.category_name ELSE NULL END) LIKE CONCAT('%', $2::text, '%') OR 
          MAX(CASE WHEN ps.category_no = '2' THEN s.category_name ELSE NULL END) LIKE CONCAT('%', $2::text, '%')
      ) sc ON p.post_id = sc.post_id
      LEFT JOIN favorites f ON p.post_id = f.post_id AND f.uid = $1
      LEFT JOIN favorites f2 ON p.post_id = f2.post_id
      WHERE
        p.deleted_at IS NULL
        AND (
          p.public_type_no = '0'
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
        )
        -- ブロック関係にあるユーザーの投稿を除外
        AND NOT EXISTS (
          SELECT 1 
          FROM user_blocks ub1
          WHERE ub1.blocker_uid = $1 AND ub1.blocked_uid = p.uid
        )
        AND NOT EXISTS (
          SELECT 1 
          FROM user_blocks ub2
          WHERE ub2.blocker_uid = p.uid AND ub2.blocked_uid = $1
        )
      ${referencePostId ? `AND p.post_id < $3` : ''}
      GROUP BY p.post_id, u.uid, sc.sub_category1, sc.sub_category2, f.uid
      ORDER BY p.post_id DESC
      LIMIT 50;
    `;

    const params = referencePostId
      ? [uid, categoryName, referencePostId]
      : [uid, categoryName];

    const rawPosts = await this.dataSource.query(sql, params);

    return rawPosts.map((raw: any) => this.toResponseDto(raw));
  }

  private toResponseDto(raw: any): PostResponseDto {
    return {
      postId: raw.post_id,
      uid: raw.uid,
      username: raw.username,
      profileImageUrl: raw.profile_image_url,
      mainCategory: raw.main_category,
      subCategory1: raw.sub_category1 || undefined,
      subCategory2: raw.sub_category2 || undefined,
      postText: raw.post_text || undefined,
      photoUrlList: raw.photo_url ? raw.photo_url.split(',') : [],
      expense: raw.expense || undefined,
      location: raw.location || undefined,
      isFavorite: raw.is_favorite,
      favoriteCount: Number(raw.favorite_count) || 0, // 明示的に number に変換
      publicTypeNo: raw.public_type_no,
      createdAt: new Date(raw.created_at),
      version: raw.version || undefined,
    };
  }
}
