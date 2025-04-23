import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserResponseDto } from 'users/application/dto/response/user.response.dto';
import { IUsersQueryService } from 'users/application/i.users.query.service';

@Injectable()
export class UsersQueryService implements IUsersQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async getFollowers(uid: string): Promise<UserResponseDto[]> {
    const sql = `
      SELECT
        u.uid,
        u.username,
        u.profile_image_url
      FROM users u
      JOIN follows f ON u.uid = f.uid
      WHERE f.following_uid = $1;
    `;
    const result = await this.dataSource.query(sql, [uid]);
    if (result.length === 0) {
      return [];
    }
    return result.map((row: any) => {
      return {
        uid: row.uid,
        username: row.username,
        profileImageUrl: row.profile_image_url,
      };
    });
  }

  async getFollowings(uid: string): Promise<UserResponseDto[]> {
    const sql = `
      SELECT
        u.uid,
        u.username,
        u.profile_image_url
      FROM users u
      JOIN follows f ON u.uid = f.following_uid
      WHERE f.uid = $1;
    `;

    const result = await this.dataSource.query(sql, [uid]);
    if (result.length === 0) {
      return [];
    }

    return result.map((row: any) => {
      return {
        uid: row.uid,
        username: row.username,
        profileImageUrl: row.profile_image_url,
      };
    });
  }
}
