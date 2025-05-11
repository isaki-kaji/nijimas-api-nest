import { DataSource } from 'typeorm';
import { IUserDetailsRepository } from '../domain/i.user-details.repository';
import { Uid } from 'modules/common/domain/value-objects/uid';
import {
  createFollowingStatus,
  FollowingStatus,
} from '../domain/value-objects/following-status';
import { Count } from '../../common/domain/value-objects/count';
import { PostInfo } from '../domain/models/post_info';
import { UserProfile } from '../domain/models/user-profile';

import { Injectable } from '@nestjs/common';
import { ImageUrl } from 'modules/common/domain/value-objects/image-url';
import { UCode } from 'modules/common/domain/value-objects/u-code';

@Injectable()
export class UserDetailsRepository implements IUserDetailsRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getUserProfile(uid: Uid): Promise<UserProfile> {
    const sql = `
      SELECT 
        u.uid,
        u.username,
        u.user_code,
        u.self_intro,
        u.profile_image_url
      FROM users u
      WHERE u.uid = $1;
    `;

    const result = await this.dataSource.query(sql, [uid.value]);
    const row = result[0];

    return this.toUserProfileModel(row);
  }

  private toUserProfileModel(row: any): UserProfile {
    const uid = Uid.create(row.uid);
    const userCode = UCode.create(row.user_code);
    const imageUrl = row.profile_image_url
      ? ImageUrl.create(row.profile_image_url)
      : undefined;
    const username = row.username;
    const selfIntro = row.self_intro;

    return new UserProfile(uid, username, userCode, selfIntro, imageUrl);
  }

  async getFollowingStatus(
    ownUid: Uid,
    targetUid: Uid,
  ): Promise<FollowingStatus> {
    const sql = `
      SELECT 
        CASE 
        WHEN EXISTS (
          SELECT 1 
          FROM follows f2
          WHERE f2.uid = $1 AND f2.following_uid = $2
          ) THEN '1'
        WHEN EXISTS (
          SELECT 1
          FROM follow_requests fr
          WHERE fr.uid = $1 AND fr.following_uid = $2 AND fr.status = '0'
          ) THEN '2'
        ELSE '0'
        END AS following_status
      FROM follows f
      WHERE f.uid = $2 OR f.following_uid = $2;
    `;

    const result = await this.dataSource.query(sql, [
      ownUid.value,
      targetUid.value,
    ]);

    const row = result[0];
    return createFollowingStatus(row.following_status);
  }

  async getFollowersCount(uid: Uid): Promise<Count> {
    const sql = `
      SELECT COUNT(*) AS followers_count
      FROM follows
      WHERE following_uid = $1;
    `;

    const result = await this.dataSource.query(sql, [uid.value]);
    const row = result[0];
    return Count.create(row.followers_count);
  }

  async getFollowingCount(uid: Uid): Promise<Count> {
    const sql = `
      SELECT COUNT(*) AS following_count
      FROM follows
      WHERE uid = $1;
    `;

    const result = await this.dataSource.query(sql, [uid.value]);
    const row = result[0];
    return Count.create(row.following_count);
  }

  async getPostInfo(uid: Uid): Promise<PostInfo> {
    const sql = `
      SELECT COUNT(*) AS post_count
      FROM posts
      WHERE uid = $1;
    `;

    const result = await this.dataSource.query(sql, [uid.value]);

    const row = result[0];

    return this.toPostInfoModel(row);
  }

  private toPostInfoModel(row: any): PostInfo {
    const postCount = Count.create(row.post_count);
    return new PostInfo(postCount);
  }

  // async getUserFavoriteSubCategories(
  //   uid: Uid,
  // ): Promise<UserFavoriteSubcategoryList> {
  //   const sql = `
  //   SELECT
  //     ufs.category_no,
  //     ufs.category_id,
  //     sc.category_name
  //   FROM user_favorite_subcategories ufs
  //   JOIN sub_categories sc
  //     ON ufs.category_id = sc.category_id
  //   WHERE ufs.uid = $1;
  // `;

  //   const result = await this.dataSource.query(sql, [uid.value]);
  //   const list = result.map((row: any) => this.toFavoriteCategoryModel(row));

  //   return new UserFavoriteSubcategoryList(list);
  // }

  // private toFavoriteCategoryModel(row: any): UserFavoriteSubcategory {
  //   const categoryNo = FavoriteCategoryNo.create(row.category_no);
  //   const categoryId = Uuid.create(row.category_id);
  //   const categoryName = row.category_name;

  //   return new UserFavoriteSubcategory(categoryId, categoryNo, categoryName);
  // }
}
